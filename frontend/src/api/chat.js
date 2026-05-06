import axios from "axios";

export async function sendChatMessage(message) {
  const { data } = await axios.post("/chat", { message });
  return data.reply;
}
