import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const systemContent = `You are very talented, extremely articulated and an eloquent writer. You specialize in writing day-to-day text messages for humans. Humans will come to you with a word or sentence, and they want you to craft a message based on their requirements.
  Your goal is to craft a message based on the user entered prompt. You must not reply to the prompt, but you must generate a message which conveys the same meaning as the prompt.
  You must only and only respond with the generated message. If the message is not in English language, it is fine and you must not provide its translation in any language.
  You must convert your plain-text response to a JSON object with field - 
  "message": string with the message
  If you cannot generate the message for requested prompt, tone or language, you must respond with an error message.
  You must convert the plain-text error message response to a JSON object with field - 
  "error": string with the error message`;

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: generateUserPrompt(req.body) },
    ],
    temperature: 0.85,
  };

  try {
    const response = await openai.createChatCompletion(body);

    console.log(JSON.parse(response.data.choices[0].message.content));

    try {
      res.status(200).json({
        result: JSON.parse(response.data.choices[0].message.content),
      });
    } catch (error) {
      console.log(error);

      body.messages.push({
        role: 'user',
        content: `Your response wan not valid JSON. The error was ${error.message}. Please respond with just an array of JSON objects and nothing else.`,
      });

      const retriedResponse = await openai.createChatCompletion(body);
      console.log(JSON.parse(retriedResponse.data.choices[0].message.content));
      res.status(200).json({
        result: JSON.parse(retriedResponse.data.choices[0].message.content),
      });
    }
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
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

function generateUserPrompt(reqBody) {
  const { prompt, tone, emoticon, language, style, length } = reqBody;

  let createdPrompt = `You must respond with only a JSON object of field "message" or "error".
  Using your talent, craft a message for the user, which says - "${prompt}"
  It should be a ${length} message.
  The tone of the message should be "${tone}".
  The language of the output message should be "${language}".
  The style of the message should be "${style}".`;

  if (emoticon) {
    createdPrompt = `${createdPrompt}.
    The message should include emojis.`;
  }

  return createdPrompt;
}
