import axios from "axios";

export async function sendChatMessage(message) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const { data } = await axios.post(`${baseUrl}/chat`, { message });
  return data.reply;
}
