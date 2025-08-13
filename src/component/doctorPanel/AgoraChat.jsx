// src/utils/agoraChat.js
// import AgoraRTM from "agora-rtm-sdk";
// import * as AgoraRTM from "agora-rtm-sdk";

// let rtmClient = null;
// let rtmChannel = null;

// export const initChat = async (appId, channelId, userId, token) => {
//   rtmClient = AgoraRTM.createInstance(appId);

//   await rtmClient.login({ uid: userId, token });

//   rtmChannel = await rtmClient.createChannel(channelId);
//   await rtmChannel.join();

//   return { rtmClient, rtmChannel };
// };

// export const sendMessage = async (message) => {
//   if (rtmChannel) {
//     await rtmChannel.sendMessage({ text: message });
//   }
// };

// export const listenForMessages = (callback) => {
//   if (rtmChannel) {
//     rtmChannel.on("ChannelMessage", ({ text }, senderId) => {
//       callback({ text, senderId });
//     });
//   }
// };

// export const logoutChat = async () => {
//   if (rtmClient) {
//     await rtmClient.logout();
//   }
// };

// AgoraChat.jsx
import React from "react";

const AgoraChat = () => {
  return (
    <div className="chat-container">
      <div className="chat-footer">
        <div className="chat-input">
          <input type="text" placeholder="Type a message" />
          <div className="chat-file-upld">
            <input type="file" />
            <span className="attach-btn">
              <img src="./images/attach-icon.svg" alt="Icon" />
            </span>
          </div>
        </div>
        <button type="submit" className="send-btn">
          <img src="./images/send-icon.svg" alt="Icon" />
        </button>
      </div>
    </div>
  );
};

export default AgoraChat;
