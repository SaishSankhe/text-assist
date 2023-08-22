# Text Assist

## Demo link:

Try out the application at [text-assist.vercel.app](https://text-assist.vercel.app)

## Table of Content:

- [About The App](#about-the-app)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Setup](#setup)

## About The App

Text assist is an application that can generate messages for the user-provided prompt. It uses AI ([OpenAI](https://openai.com/)) to generate the message. Users can also adjust options such as the tone of the message, language, style (casual, semi-formal, formal), length and whether to include emojis or not. After a message is generated, the user can copy the message with a single click and is ready to paste it anywhere.

### Note

If the application is not generating a message and displaying "Apologies..." message, it might be because the OpenAI API being used is a free tier API and have been rate limited.

## Screenshots

<p align="center">
  <img src="public/preview-1.png" alt="Homepage - no prompt provided" title="Homepage - no prompt provided" width="70%">
</p>
<p align="center">
  <img src="public/preview-2.png" alt="[Message generated with copy button" title="[Message generated with copy button" width="70%">
</p>
<p align="center">
  <img src="public/preview-3.png" alt="Message options" title="Message options" width="70%">
</p>

## Technologies

- [Next.js](https://nextjs.org/)
- [OpenAI API](https://platform.openai.com/overview)
- [Ant Design](https://ant.design/)
- [TailwindCSS](https://tailwindcss.com/)
- [Styled components](https://styled-components.com/)


## Setup

- Download or clone the repository
- Run "`npm install`"
- Run "`npm run dev`"
- The project will be running on `http://localhost:3000/`
