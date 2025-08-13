import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "./Firebase";

// Helper function for image URL detection (keep this outside the component or memoized)
const isImageURL = (str) => {
  if (typeof str !== "string") return false;
  const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)(\?.*)?(#.*)?$/i;
  return (
    (str.startsWith("http://") || str.startsWith("https://")) &&
    imageRegex.test(str)
  );
};

function Chat({ chat_id, senderImg, receiverImg }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef(null); // Ref for the scrollable container's end

  const chatId = chat_id;
  const ids = chat_id.split("_");
  const myUserId = ids[1];
  const otherParticipantId = ids[2];

  // --- Helper functions for Date Separator ---
  const formatDateForSeparator = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isSameDay = (timestamp1, timestamp2) => {
    if (!timestamp1 || !timestamp2) return false;
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  // --- End Helper functions ---

  useEffect(() => {
    if (!chatId) {
      console.warn("chatId is missing, skipping message fetch.");
      return;
    }
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // --- UPDATED useEffect for consistent auto-scrolling ---
  // This will scroll to the bottom whenever messages state changes.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!chatId || !myUserId || !otherParticipantId) return;

    const messagesToMarkQuery = query(
      collection(db, "chats", chatId, "messages"),
      where("senderId", "==", otherParticipantId),
      where("seen", "==", false)
    );

    const unsubscribeSeenUpdater = onSnapshot(
      messagesToMarkQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const batch = writeBatch(db);

          snapshot.docs.forEach((docSnap) => {
            const messageRef = doc(db, "chats", chatId, "messages", docSnap.id);
            batch.update(messageRef, { seen: true });
          });

          batch
            .commit()
            .then(() => {
              // console.log(
              //   `Marked ${snapshot.docs.length} messages from ${otherParticipantId} as seen by ${myUserId} in chat ${chatId}`
              // );
            })
            .catch((error) => {
              console.error("Error marking messages as seen:", error);
            });
        }
      }
    );

    return () => unsubscribeSeenUpdater();
  }, [chatId, myUserId, otherParticipantId]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageFile) {
      return;
    }

    setIsUploading(true);

    const clientTimestamp = Date.now();
    let messageData = {
      senderId: myUserId,
      receiverId: otherParticipantId,
      timestamp: clientTimestamp,
      seen: false,
      type: "text", // Default to text, will be overridden for image
    };

    try {
      if (imageFile) {
        const imageFileName = `chat_images/${chatId}/${uuidv4()}-${
          imageFile.name
        }`;
        const storageReference = ref(storage, imageFileName);

        const uploadTaskSnapshot = await uploadBytes(
          storageReference,
          imageFile
        );
        const imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);

        messageData = {
          ...messageData,
          type: "image",
          message: imageUrl,
        };
      } else {
        messageData = {
          ...messageData,
          type: "text",
          message: text,
        };
      }

      await addDoc(collection(db, "chats", chatId, "messages"), messageData);

      setText("");
      setImageFile(null);
      clearImage();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="completed-appoint-scrn-right col-lg-6">
      <div className="completed-appoint-chat-scrn">
        <div
          className="chat-container"
          style={{ padding: "20px", maxHeight: "600px" }}
        >
          {/* Apply ref to the actual scrollable div */}
          <div
            className="chat-messages"
            ref={messagesEndRef} // <-- Ensure this ref is on the scrollable div
            style={{
              height: "400px", // Make sure this height is fixed for scrolling to work
              overflowY: "scroll",
              marginBottom: "10px",
              WebkitOverflowScrolling: "touch",
              overflowX: "hidden",
            }}
          >
            {messages.map((msg, index) => {
              const isMyMessage = msg.senderId === myUserId;
              const messageBackgroundColor = isMyMessage
                ? "#DAEFF9"
                : "#DAEFF9";
              const messageJustifyContent = isMyMessage
                ? "flex-end"
                : "flex-start";

              const myMessageBorderRadius = {
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "4px",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
              };
              const otherMessageBorderRadius = {
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "12px",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
              };

              let showDateSeparator = false;
              if (msg.timestamp) {
                if (index === 0) {
                  showDateSeparator = true;
                } else {
                  const prevMsg = messages[index - 1];
                  const prevTimestamp = prevMsg.timestamp?.toDate
                    ? prevMsg.timestamp.toDate().getTime()
                    : prevMsg.timestamp;
                  const currentTimestamp = msg.timestamp?.toDate
                    ? msg.timestamp.toDate().getTime()
                    : msg.timestamp;

                  if (prevMsg && prevTimestamp) {
                    showDateSeparator = !isSameDay(
                      currentTimestamp,
                      prevTimestamp
                    );
                  } else {
                    showDateSeparator = true;
                  }
                }
              }

              return (
                <React.Fragment key={msg.id}>
                  {showDateSeparator && (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "20px 0 10px",
                        position: "relative",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#f0f2f5",
                          padding: "5px 12px",
                          borderRadius: "15px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        {formatDateForSeparator(
                          msg.timestamp?.toDate
                            ? msg.timestamp.toDate().getTime()
                            : msg.timestamp
                        )}
                      </span>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "0",
                          right: "0",
                          height: "1px",
                          backgroundColor: "#e0e0e0",
                          zIndex: -1,
                        }}
                      ></div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: messageJustifyContent,
                      margin: "8px 0",
                      alignItems: "flex-end",
                    }}
                  >
                    {!isMyMessage && (
                      <div style={{ marginRight: "8px" }}>
                        <img
                          src={receiverImg}
                          alt="Receiver Avatar"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        padding: "10px 14px",
                        backgroundColor: messageBackgroundColor,
                        maxWidth: "70%",
                        fontSize: "14px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        wordBreak: "break-word",
                        ...(isMyMessage
                          ? myMessageBorderRadius
                          : otherMessageBorderRadius),
                      }}
                    >
                      {isImageURL(msg.message) ? (
                        <img
                          src={msg.message}
                          alt="Message attachment"
                          style={{
                            maxWidth: "100%",
                            width: "200px", // Changed from 250px
                            height: "250px", // Changed from 300px
                            objectFit: "cover",
                            borderRadius: "8px",
                            display: "block",
                          }}
                          onError={(e) => {
                            console.error(
                              "Error loading image from URL:",
                              e.target.src
                            );
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        msg.message && <div>{msg.message}</div>
                      )}
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#666",
                          marginTop: "6px",
                          textAlign: isMyMessage ? "right" : "left",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: isMyMessage
                            ? "flex-end"
                            : "flex-start",
                          gap: "4px",
                          alignSelf: "flex-end",
                        }}
                      >
                        {msg.timestamp
                          ? new Date(
                              msg.timestamp?.toDate
                                ? msg.timestamp.toDate().getTime()
                                : msg.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}

                        {isMyMessage &&
                          (msg.seen ? (
                            <span
                              style={{
                                color: "#007bff",
                                marginLeft: "4px",
                              }}
                            >
                              ✓✓
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#888",
                                marginLeft: "4px",
                              }}
                            >
                              ✓
                            </span>
                          ))}
                      </div>
                    </div>

                    {isMyMessage && (
                      <div style={{ marginLeft: "8px" }}>
                        <img
                          src={senderImg}
                          alt="Sender Avatar"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          {imageFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginBottom: "10px",
                border: "1px solid #eee",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected preview"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginRight: "10px",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#555" }}>
                  {imageFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={clearImage}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4d4d",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "5px",
                  lineHeight: "1",
                }}
                disabled={isUploading}
              >
                &times;
              </button>
            </div>
          )}

          <form
            onSubmit={sendMessage}
            className="chat-footer"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              className="chat-input"
              style={{ flex: 1, position: "relative" }}
            >
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  isUploading ? "Uploading image..." : "Type a message"
                }
                style={{
                  width: "100%",
                  padding: "10px 45px 10px 15px",
                  borderRadius: "30px",
                  border: "1px solid #ccc",
                }}
                disabled={isUploading}
              />
              <div
                className="chat-file-upld"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="fileInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                <label
                  htmlFor="fileInput"
                  className="attach-btn"
                  style={{ cursor: "pointer" }}
                >
                  <img src="./images/attach-icon.svg" alt="Attach" />
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="send-btn"
              disabled={isUploading || (!text.trim() && !imageFile)}
            >
              <img src="./images/send-icon.svg" alt="Icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
