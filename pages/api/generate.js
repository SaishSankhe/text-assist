import { Configuration, OpenAIApi } from 'openai';

let keySwitch = 1;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_1,
});
const openai = new OpenAIApi(configuration);

const useDaVinciModel = parseInt(process.env.USE_DAVINCI_MODEL);

const systemPrompt = `Assume you are a very talented, extremely articulated and an eloquent writer. You specialize in writing day-to-day text messages for humans. Humans will come to you with a word or sentence as a prompt, and  your goal is to craft a message based on the user entered prompt.
You must not reply to the prompt, but you must generate a message which conveys the same meaning as the prompt.
You must only and only respond with the generated message. If the message is not in English language, you must not provide its translation in any language.
You must convert your plain-text response to a JSON object with field - 
"message": string with the message
If you cannot generate the message for requested prompt, tone or language, you must respond with an error message.
You must convert the plain-text error message response to a JSON object with field - 
"error": string with the error message`;

export default async function (req, res) {
  if (keySwitch === 1) {
    configuration.apiKey = process.env.OPENAI_API_KEY_1;
    keySwitch = 2;
  } else {
    configuration.apiKey = process.env.OPENAI_API_KEY_2;
    keySwitch = 1;
  }

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  let body;

  const logger = {
    isDavinciModel: useDaVinciModel,
    '!!useDavinciModel': !!useDaVinciModel,
    keySwitch: keySwitch,
  };

  console.table(logger);

  if (!!useDaVinciModel) {
    console.log('Using da-vinci');
    // TEXT Da-Vinci
    body = await useDaVinci(systemPrompt, req.body);
  } else {
    console.log('Using 3.5-turbo');
    // CHAT - GPT 3.5 Turbo
    body = await useGPT35Turbo(systemPrompt, req.body);
  }

  try {
    if (useDaVinciModel) {
      // TEXT Da-Vinci
      const response = await openai.createCompletion(body);

      res.status(200).json({
        result: JSON.parse(response.data.choices[0].text),
      });
    } else {
      // CHAT - GPT 3.5 Turbo
      const response = await openai.createChatCompletion(body);

      res.status(200).json({
        result: JSON.parse(response.data.choices[0].message.content),
      });
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

const useGPT35Turbo = async (systemPrompt, reqBody) => {
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: generateUserPrompt(reqBody) },
    ],
    temperature: 0.85,
  };

  return body;
};

const useDaVinci = async (systemPrompt, reqBody) => {
  const body = {
    model: 'text-davinci-003',
    prompt: systemPrompt + generateUserPrompt(reqBody),
    temperature: 0.85,
    max_tokens: 1024,
  };

  return body;
};

function generateUserPrompt(reqBody) {
  const { prompt, tone, emoticon, language, style, length } = reqBody;

  let createdPrompt = `Your response must only be a JSON object of field "message" or "error".
  Using your talent, craft a message for the user, which says - "${prompt}"
  The message should be of ${length} length, in ${tone} tone, in ${language} language and ${style} style.`;

  if (emoticon) {
    createdPrompt = `${createdPrompt}.
    The message should include emojis. Include emojis in the string.`;
  }

  return createdPrompt;
}
