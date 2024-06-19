import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import axios from 'axios';

// Type guard to check if an error is an instance of Error
function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined;
}

export let loader: LoaderFunction = async () => {
  return json({ message: "POST requests only" });
};

export let action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ message: "Only POST requests are allowed" }, { status: 405 });
  }

  try {
    const { prompt } = await request.json();

    const response = await axios.post('http://localhost:5000/api/v1/run', {
      model: 'llama2',
      prompt,
    });

    return json(response.data);
  } catch (error: unknown) {
    if (isError(error)) {
      return json({ message: 'Error communicating with Ollama', error: error.message }, { status: 500 });
    } else {
      return json({ message: 'Unknown error occurred' }, { status: 500 });
    }
  }
};