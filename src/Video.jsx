// import React, { useEffect, useRef, useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// const Video = ({ isCameraOn, isMuted }) => {
//   const location = useLocation();
//   const { name } = location.state || {};
//   const firstLetter = name.charAt(0); // or name[0]

// console.log(firstLetter, "fkasjdfksahfsaghfhskld");

//   const { channelDetails } = useSelector((state) => state.appointments);
// console.log(
//     channelDetails?.appId,
//     channelDetails?.token,
//     channelDetails?.channelName,
//     channelDetails?.uid,
//     "videoCall"
//   );
//   const APP_ID = channelDetails?.appId;
//   const TOKEN = channelDetails?.token;

//   const CHANNEL = channelDetails?.channelName;

//   const uid = 0;

//   const localVideoRef = useRef(null);
//   const client = useRef(null);
//   const localAudioTrack = useRef(null);
//   const localVideoTrack = useRef(null);

//   const [remoteUsers, setRemoteUsers] = useState({});

//   useEffect(() => {
//     client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

//     const initAgora = async () => {
//       try {
//         await client.current.join(APP_ID, CHANNEL, TOKEN, uid);

//         localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
//         localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

//         localVideoTrack.current.play(localVideoRef.current);

//         await client.current.publish([
//           localAudioTrack.current,
//           localVideoTrack.current,
//         ]);

//         // Remote user joins
//         client.current.on("user-published", async (user, mediaType) => {
//           await client.current.subscribe(user, mediaType);
//           if (mediaType === "video") {
//             const playerContainerId = `remote-player-${user.uid}`;
//             setTimeout(() => {
//               user.videoTrack?.play(playerContainerId);
//             }, 300);
//           }
//           if (mediaType === "audio") {
//             user.audioTrack?.play();
//           }

//           setRemoteUsers((prevUsers) => ({
//             ...prevUsers,
//             [user.uid]: {
//               ...user,
//               audioMuted: !user.hasAudio,
//               videoMuted: !user.hasVideo,
//             },
//           }));

//           // if (mediaType === "video") {
//           //   user.videoTrack.play(`remote-player-${user.uid}`);
//           // }
//           // if (mediaType === "audio") {
//           //   user.audioTrack.play();
//           // }
//         });

//         // Remote user updates (e.g., mute/unmute)
//         client.current.on("user-updated", (user) => {
//           const playerContainerId = `remote-player-${user.uid}`;
//           if (user.hasVideo && user.videoTrack) {
//             setTimeout(() => {
//               user.videoTrack.play(playerContainerId);
//             }, 300);
//           }
//           setRemoteUsers((prevUsers) => ({
//             ...prevUsers,
//             [user.uid]: {
//               ...user,
//               audioMuted: !user.hasAudio,
//               videoMuted: !user.hasVideo,
//             },
//           }));
//         });

//         // Remote user leaves
//         client.current.on("user-unpublished", (user, mediaType) => {
//           setRemoteUsers((prevUsers) => {
//             const updatedUsers = { ...prevUsers };
//             delete updatedUsers[user.uid];
//             return updatedUsers;
//           });
//         });

//         client.current.on("user-left", async (user) => {
//           setRemoteUsers((prevUsers) => {
//             const updatedUsers = { ...prevUsers };
//             delete updatedUsers[user.uid];
//             return updatedUsers;
//           });
//           if (localAudioTrack.current) localAudioTrack.current.close();
//           if (localVideoTrack.current) localVideoTrack.current.close();
//           await client.current.leave();
//           // window.location.href ="/doctorhome";
//         });
//       } catch (error) {
//         console.error("Agora error:", error);
//       }
//     };

//     initAgora();

//     return () => {
//       const leaveChannel = async () => {
//         if (localAudioTrack.current) localAudioTrack.current.close();
//         if (localVideoTrack.current) localVideoTrack.current.close();
//         await client.current?.leave();
//         setRemoteUsers({});
//       };
//       leaveChannel();
//     };
//   }, []);

//   useEffect(() => {
//     if (localVideoTrack.current && localVideoRef.current) {
//       localVideoTrack.current.play(localVideoRef.current);
//     }
//   }, [remoteUsers]);

//   useEffect(() => {
//     if (localVideoTrack.current) {
//       localVideoTrack.current.setEnabled(isCameraOn);
//     }
//   }, [isCameraOn]);

//   useEffect(() => {
//     if (localAudioTrack.current) {
//       localAudioTrack.current.setEnabled(!isMuted);
//     }
//   }, [isMuted]);

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100%",
//         height: "700px",
//         backgroundColor: "#000",
//       }}
//     >
//       {/* Remote videos */}
//       <div
//         id="remote-video"
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "90%",
//           backgroundColor: "#0c0d0f",
//           zIndex: 1,
//         }}
//       >
//         {Object.entries(remoteUsers).map(([uid, user]) => (
//           <div
//             key={uid}
//             id={`remote-player-${uid}`}
//             style={{
//               width: "100%",
//               height: "100%",
//               position: "relative",
//               backgroundColor: "#0c0d0f",
//             }}
//           >
//             {/* Status Overlay */}
//             {/* <div
//               style={{
//                 position: "absolute",
//                 bottom: 50,
//                 left: 10,
//                 backgroundColor: "red",
//                 color: "#fff",
//                 padding: "6px 10px",
//                 borderRadius: "6px",
//                 fontSize: "14px",
//                 zIndex: 5,
//                 // backgroundColor: "white",
//               }}
//             >
//               Video: {user.videoMuted ? "Off" : "On"} <br />
//               Audio: {user.audioMuted ? "Off" : "On"}
//             </div> */}
//           </div>
//         ))}
//       </div>

//       {/* Local video preview */}
//       <div style={{ position: "relative", height: "100vh" }}>
//         {isCameraOn ? (
//           <div
//             ref={localVideoRef}
//             style={{
//               position: "absolute",
//               bottom: -20,
//               right: 20,
//               width: "150px",
//               height: "200px",
//               backgroundColor: "#222",
//               zIndex: 2,
//               borderRadius: 8,
//               overflow: "hidden",
//             }}
//           />
//         ) : (
//           <div
//             style={{
//               position: "absolute",
//               bottom: -20,
//               right: 20,
//               width: "150px",
//               height: "200px",
//               backgroundColor: "#0c0d0f",
//               borderRadius: 8,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               fontSize: "48px",
//               fontWeight: "bold",
//               zIndex: 2,
//             }}
//           >
//             {/* {firstLetter} */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Video;

// Inside your original useEffect:
// import React, { useEffect, useRef, useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// const Video = ({ isCameraOn, isMuted }) => {
//   const location = useLocation();
//   const { name } = location.state || {};
//   const firstLetter = name ? name.charAt(0) : ""; // Safely get first letter

// console.log(firstLetter, "fkasjdfksahfsaghfhskld");

//   const { channelDetails } = useSelector((state) => state.appointments);
// console.log(
//     channelDetails?.appId,
//     channelDetails?.token,
//     channelDetails?.channelName,
//     channelDetails?.uid,
//     "videoCall"
//   );
//   const APP_ID = channelDetails?.appId;
//   const TOKEN = channelDetails?.token;

//   const CHANNEL = channelDetails?.channelName;

//   const uid = 0; // Using 0 as per your original code, ensure this is correct

//   const localVideoRef = useRef(null);
//   const client = useRef(null);
//   const localAudioTrack = useRef(null);
//   const localVideoTrack = useRef(null);

//   const [remoteUsers, setRemoteUsers] = useState({});

//   useEffect(() => {
//     client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

//     const initAgora = async () => {
//       try {
//         // Add these logs to your ORIGINAL code to confirm values
// console.log("Joining channel with:", { APP_ID, CHANNEL, TOKEN, uid });
//         if (!APP_ID || !CHANNEL || !TOKEN) {
//           console.error("DEBUG: Missing Agora channel details before join.");
//           // return; // Don't return yet in original if it was working
//         }

//         await client.current.join(APP_ID, CHANNEL, TOKEN, uid);

//         localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
//         localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

//         localVideoTrack.current.play(localVideoRef.current);

//         await client.current.publish([
//           localAudioTrack.current,
//           localVideoTrack.current,
//         ]);

//         // Remote user joins
//         client.current.on("user-published", async (user, mediaType) => {
//           await client.current.subscribe(user, mediaType);
//           if (mediaType === "video") {
//             const playerContainerId = `remote-player-${user.uid}`;
//             setTimeout(() => {
//               if (document.getElementById(playerContainerId)) {
//                 // Added check
//                 user.videoTrack?.play(playerContainerId);
//               }
//             }, 300);
//           }
//           if (mediaType === "audio") {
//             user.audioTrack?.play();
//           }

//           setRemoteUsers((prevUsers) => ({
//             ...prevUsers,
//             [user.uid]: {
//               ...user,
//               audioMuted: !user.hasAudio,
//               videoMuted: !user.hasVideo,
//             },
//           }));
//         });

//         // **** THIS IS THE ONLY SECTION YOU SHOULD CHANGE IN YOUR ORIGINAL CODE ****
//         // Remote user updates (e.g., mute/unmute) - APPLY THE FIX HERE
//         client.current.on("user-updated", (user, mediaType) => {
//           // Added mediaType param
// console.log(`User ${user.uid} updated: ${mediaType}`);

//           setRemoteUsers((prevUsers) => {
//             const currentUserState = prevUsers[user.uid] || {};
//             const videoStatusChanged =
//               currentUserState.videoMuted !== !user.hasVideo;

//             const updatedUser = {
//               ...currentUserState,
//               ...user,
//               audioMuted: !user.hasAudio,
//               videoMuted: !user.hasVideo,
//             };

//             // Only play video if it was explicitly enabled AND its status has changed
//             if (
//               mediaType === "video" &&
//               user.hasVideo &&
//               user.videoTrack &&
//               videoStatusChanged
//             ) {
//               const playerContainerId = `remote-player-${user.uid}`;
//               setTimeout(() => {
//                 if (document.getElementById(playerContainerId)) {
//                   user.videoTrack.play(playerContainerId);
//                 }
//               }, 300);
//             }

//             return {
//               ...prevUsers,
//               [user.uid]: updatedUser,
//             };
//           });
//         });
//         // ************************************************************************

//         // Remote user leaves (user-unpublished)
//         client.current.on("user-unpublished", (user, mediaType) => {
//           if (mediaType === "video" && user.videoTrack) {
//             user.videoTrack.stop(); // Stop the video track when it's unpublished
//           }
//           setRemoteUsers((prevUsers) => {
//             const updatedUsers = { ...prevUsers };
//             if (updatedUsers[user.uid]) {
//               if (mediaType === "audio") {
//                 updatedUsers[user.uid].audioMuted = true;
//               } else if (mediaType === "video") {
//                 updatedUsers[user.uid].videoMuted = true;
//               }
//             }
//             return updatedUsers;
//           });
//         });

//         // Remote user leaves (user-left)
//         client.current.on("user-left", async (user) => {
//           setRemoteUsers((prevUsers) => {
//             const updatedUsers = { ...prevUsers };
//             delete updatedUsers[user.uid];
//             return updatedUsers;
//           });
//           // No need to close local tracks/leave here, useEffect cleanup handles it
//         });
//       } catch (error) {
//         console.error("Agora error:", error);
//       }
//     };

//     initAgora();

//     return () => {
//       const leaveChannel = async () => {
//         if (localAudioTrack.current) localAudioTrack.current.close();
//         if (localVideoTrack.current) localVideoTrack.current.close();
//         await client.current?.leave();
//         setRemoteUsers({});
//       };
//       leaveChannel();
//     };
//   }, []); // Keep your original empty dependency array for now

//   // Your original useEffect, likely causing re-renders that affect local video.
//   // Commenting it out as it's not strictly necessary for local video playback after initial play
//   // and can cause issues if not carefully managed.
//   // useEffect(() => {
//   //   if (localVideoTrack.current && localVideoRef.current) {
//   //     localVideoTrack.current.play(localVideoRef.current);
//   //   }
//   // }, [remoteUsers]);

//   useEffect(() => {
//     if (localVideoTrack.current) {
//       localVideoTrack.current.setEnabled(isCameraOn);
//     }
//   }, [isCameraOn]);

//   useEffect(() => {
//     if (localAudioTrack.current) {
//       localAudioTrack.current.setEnabled(!isMuted);
//     }
//   }, [isMuted]);

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100%",
//         height: "700px",
//         backgroundColor: "#000",
//       }}
//     >
//       {/* Remote videos */}
//       <div
//         id="remote-video"
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "90%",
//           backgroundColor: "#0c0d0f",
//           zIndex: 1,
//         }}
//       >
//         {Object.entries(remoteUsers).map(([uid, user]) => (
//           <div
//             key={uid}
//             id={`remote-player-${uid}`}
//             style={{
//               width: "100%",
//               height: "100%",
//               position: "relative",
//               backgroundColor: "#0c0d0f",
//               display: user.videoMuted ? "none" : "block", // Hide div if video is muted
//             }}
//           >
//             {user.videoMuted && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   color: "#fff",
//                   fontSize: "48px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Video Off
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Local video preview */}
//       <div style={{ position: "relative", height: "100vh" }}>
//         {isCameraOn ? (
//           <div
//             ref={localVideoRef}
//             style={{
//               position: "absolute",
//               bottom: -20,
//               right: 20,
//               width: "150px",
//               height: "200px",
//               backgroundColor: "#222",
//               zIndex: 2,
//               borderRadius: 8,
//               overflow: "hidden",
//             }}
//           />
//         ) : (
//           <div
//             style={{
//               position: "absolute",
//               bottom: -20,
//               right: 20,
//               width: "150px",
//               height: "200px",
//               backgroundColor: "#0c0d0f",
//               borderRadius: 8,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               fontSize: "48px",
//               fontWeight: "bold",
//               zIndex: 2,
//             }}
//           >
//             {firstLetter}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// // export default Video;

//code commented date 23-06-2025

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useSelector } from "react-redux";

// import { CiMicrophoneOff } from "react-icons/ci";

// import { useLocation } from "react-router-dom";

// const Video = ({ isCameraOn, isMuted, patientInfo }) => {
//   const location = useLocation();
//   // const { name: localUserName } = location.state || {}; // Renamed 'name' to 'localUserName' for clarity
//   const localUserInitial = patientInfo
//     ? patientInfo.charAt(0).toUpperCase()
//     : "";

// console.log(
//   //   `Local user name: ${localUserName}, Initial: ${localUserInitial}`
//   // );

//   const { channelDetails } = useSelector((state) => state.appointments);

//   // Destructure Agora details with fallback null, ensures explicit check
//   const APP_ID = channelDetails?.appId || null;
//   const TOKEN = channelDetails?.token || null;
//   const CHANNEL = channelDetails?.channelName || null;
//   const UID = channelDetails?.uid || 0; // Default to 0 if UID isn't specifically provided

// console.log("Agora Config (from Redux):", { APP_ID, TOKEN, CHANNEL, UID });

//   // Refs for Agora RTC client and tracks
//   const client = useRef(null);
//   const localAudioTrack = useRef(null);
//   const localVideoTrack = useRef(null);
//   const localVideoRef = useRef(null); // Ref for the local video element

//   // State to manage remote users, structured for display and mute status
//   const [remoteUsers, setRemoteUsers] = useState({});

//   // --- Helper function to get remote user's display name/initial ---
//   // IMPORTANT: You MUST implement this based on how your app gets user data.
//   // This is a placeholder. Agora RTC SDK itself does not provide names.
//   const getRemoteUserDetails = useCallback((remoteUid) => {
//     // Replace this with your actual logic to fetch user data (e.g., from a database,
//     // a list of participants from your signaling server, etc.).
//     // For demonstration, we'll return a generic name and initial.
//     // In a real app, you might have a map like:
//     // const userDataMap = { 1234: { name: "Alice" }, 5678: { name: "Bob" } };
//     // return userDataMap[remoteUid] || { name: `Guest ${remoteUid}` };

//     const name = `Remote User ${remoteUid}`; // Placeholder name
//     const initial = name.charAt(0).toUpperCase();
//     return { name, initial };
//   }, []); // Dependencies for useCallback: if data source changes, regenerate

//   // --- Main Agora Initialization Effect ---
//   useEffect(() => {
//     // 1. Initialize AgoraRTC client
//     if (!client.current) {
// console.log("Creating new AgoraRTC client instance.");
//       client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//     }

//     const initAgora = async () => {
//       // Ensure all necessary credentials are present before attempting to join
//       if (!APP_ID || !CHANNEL || !TOKEN) {
//         console.error(
//           "Agora Error: Missing APP_ID, CHANNEL, or TOKEN. Cannot join."
//         );
//         return; // Exit if critical config is missing
//       }

//       try {
// console.log(`Attempting to join channel: ${CHANNEL} with UID: ${UID}`);
//         await client.current.join(APP_ID, CHANNEL, TOKEN, UID);
// console.log("Successfully joined Agora channel.");

//         // 2. Create local audio and video tracks
//         localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
//         localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
// console.log("Local audio and video tracks created.");

//         // 3. Play local video in the designated ref container
//         if (localVideoRef.current) {
//           localVideoTrack.current.play(localVideoRef.current);
// console.log("Local video track playing.");
//         } else {
//           console.warn(
//             "Local video ref is not available. Cannot play local video."
//           );
//         }

//         // 4. Publish local tracks to the channel
//         await client.current.publish([
//           localAudioTrack.current,
//           localVideoTrack.current,
//         ]);
// console.log("Local audio and video tracks published.");

//         // --- Agora Event Listeners ---

//         // user-published: A remote user has published their audio or video stream
//         client.current.on("user-published", async (user, mediaType) => {
// console.log(`User ${user.uid} published ${mediaType} track.`);
//           await client.current.subscribe(user, mediaType); // Subscribe to the published track

//           // Get remote user's display details
//           const { name: remoteUserName, initial: remoteUserInitial } =
//             getRemoteUserDetails(user.uid);

//           setRemoteUsers((prevUsers) => ({
//             ...prevUsers,
//             [user.uid]: {
//               ...user, // Spread Agora user object (hasAudio, hasVideo, uid, etc.)
//               audioMuted: !user.hasAudio, // Custom UI state
//               videoMuted: !user.hasVideo, // Custom UI state
//               remoteDisplayName: remoteUserName, // Store remote user's name
//               remoteDisplayInitial: remoteUserInitial, // Store remote user's initial
//             },
//           }));

//           if (mediaType === "video") {
//             const playerContainerId = `remote-player-${user.uid}`;
//             // Small timeout to ensure the DOM element is rendered and ready
//             setTimeout(() => {
//               if (document.getElementById(playerContainerId)) {
//                 user.videoTrack?.play(playerContainerId);
// console.log(
//                   `Playing video for user ${user.uid} in ${playerContainerId}`
//                 );
//                 // After playing, ensure the video element itself fills its parent
//                 const videoElement = document
//                   .getElementById(playerContainerId)
//                   .querySelector("video");
//                 if (videoElement) {
//                   videoElement.style.width = "100%";
//                   videoElement.style.height = "100%";
//                   videoElement.style.objectFit = "cover"; // Ensure video covers the area without distortion
//                 }
//               } else {
//                 console.warn(
//                   `Video player container ${playerContainerId} not found for user ${user.uid}.`
//                 );
//               }
//             }, 300);
//           } else if (mediaType === "audio") {
//             user.audioTrack?.play();
// console.log(`Playing audio for user ${user.uid}.`);
//           }
//         });

//         // user-updated: A remote user's stream properties have changed (e.g., mute/unmute)
//         client.current.on("user-updated", (user, mediaType) => {
// console.log(
//             `User ${user.uid} updated: ${mediaType} (hasAudio: ${user.hasAudio}, hasVideo: ${user.hasVideo})`
//           );

//           setRemoteUsers((prevUsers) => {
//             const currentUserState = prevUsers[user.uid] || {};

//             // Determine if video state has truly changed to re-play if needed
//             // Only re-play if video was previously off and is now on
//             const videoStateChangedFromOffToOn =
//               currentUserState.videoMuted && user.hasVideo;

//             const updatedUser = {
//               ...currentUserState, // Keep previous custom properties
//               ...user, // Overlay with latest Agora user object properties
//               audioMuted: !user.hasAudio, // Update audio mute status
//               videoMuted: !user.hasVideo, // Update video mute status
//             };

//             // Re-play video only if the video track was made available and its state changed
//             // This prevents re-playing when only audio status changes or if video was already on.
//             if (
//               mediaType === "video" &&
//               user.hasVideo &&
//               user.videoTrack &&
//               videoStateChangedFromOffToOn
//             ) {
//               const playerContainerId = `remote-player-${user.uid}`;
//               setTimeout(() => {
//                 if (document.getElementById(playerContainerId)) {
//                   user.videoTrack.play(playerContainerId);
// console.log(
//                     `Re-playing video for user ${user.uid} due to video state change (off to on).`
//                   );
//                   // After re-playing, ensure the video element itself fills its parent
//                   const videoElement = document
//                     .getElementById(playerContainerId)
//                     .querySelector("video");
//                   if (videoElement) {
//                     videoElement.style.width = "100%";
//                     videoElement.style.height = "100%";
//                     videoElement.style.objectFit = "cover";
//                   }
//                 }
//               }, 300);
//             }

//             return {
//               ...prevUsers,
//               [user.uid]: updatedUser,
//             };
//           });
//         });

//         // user-unpublished: A remote user has stopped publishing a track (e.g., turned off camera/mic)
//         client.current.on("user-unpublished", (user, mediaType) => {
// console.log(`User ${user.uid} unpublished ${mediaType} track.`);
//           if (mediaType === "video" && user.videoTrack) {
//             user.videoTrack.stop(); // Stop the video track when it's unpublished
// console.log(`Stopped video for user ${user.uid}.`);
//           }
//           // Update remoteUsers state to reflect the track being unpublished
//           setRemoteUsers((prevUsers) => {
//             const updatedUsers = { ...prevUsers };
//             if (updatedUsers[user.uid]) {
//               if (mediaType === "audio") {
//                 updatedUsers[user.uid].audioMuted = true;
//               } else if (mediaType === "video") {
//                 updatedUsers[user.uid].videoMuted = true;
//               }
//             }
//             return updatedUsers;
//           });
//         });

//         // user-left: A remote user has left the channel
//         client.current.on("user-left", async (user) => {
// console.log(`User ${user.uid} left the channel.`);
//           setRemoteUsers((prevUsers) => {
//             const updatedUsers = { ...prevUsers };
//             delete updatedUsers[user.uid]; // Remove user from state
//             return updatedUsers;
//           });
//         });
//       } catch (error) {
//         console.error("Agora Operation Error:", error);
//         // More specific error handling could go here (e.g., token expired, network error)
//         // You might want to display a user-friendly message or attempt a reconnection
//       }
//     };

//     // Call the initialization function
//     initAgora();

//     // --- Cleanup function for useEffect (component unmount or dependencies change) ---
//     return () => {
// console.log("Running Agora cleanup.");
//       const leaveChannel = async () => {
//         // Stop and close local tracks
//         if (localAudioTrack.current) {
//           localAudioTrack.current.close();
//           localAudioTrack.current = null;
// console.log("Local audio track closed.");
//         }
//         if (localVideoTrack.current) {
//           localVideoTrack.current.close();
//           localVideoTrack.current = null;
// console.log("Local video track closed.");
//         }
//         // Leave the channel if the client exists
//         if (client.current && client.current.connectionState === "CONNECTED") {
//           await client.current.leave();
// console.log("Left Agora channel.");
//         }
//         client.current = null; // Clear the client ref
//         setRemoteUsers({}); // Clear all remote users from state
// console.log("Agora resources cleaned up.");
//       };
//       leaveChannel();
//     };
//   }, [APP_ID, CHANNEL, TOKEN, UID, getRemoteUserDetails]); // Dependencies: Re-run if config or user data function changes

//   // --- Effects for controlling local camera and microphone ---

//   // Control local video track enabled/disabled based on `isCameraOn` prop
//   useEffect(() => {
//     if (localVideoTrack.current) {
// console.log(`Setting local camera to: ${isCameraOn ? "On" : "Off"}`);
//       localVideoTrack.current.setEnabled(isCameraOn);
//     }
//   }, [isCameraOn]);

//   // Control local audio track enabled/disabled based on `isMuted` prop
//   useEffect(() => {
//     if (localAudioTrack.current) {
// console.log(
//         `Setting local microphone to: ${isMuted ? "Muted" : "Unmuted"}`
//       );
//       localAudioTrack.current.setEnabled(!isMuted); // `isMuted` true means audio OFF, so setEnabled(!true)
//     }
//   }, [isMuted]);

//   // --- Rendered Component UI ---
//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100%",
//         height: "700px", // Base height for the video container
//         backgroundColor: "#000",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden", // Prevent content overflow
//       }}
//     >
//       {/* Remote videos container */}
//       <div
//         id="remote-video-grid-container" // More descriptive ID
//         style={{
//           flexGrow: 1, // Takes up remaining space
//           backgroundColor: "#0c0d0f",
//           display: "grid",
//           // Adjust grid for responsiveness based on number of users
//           gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//           gap: "10px",
//           // padding: "10px",
//           overflowY: "auto", // Enable scrolling if many remote users
//           justifyContent: "center", // Center grid items
//           alignContent: "center", // Center grid rows
//           width: "100%",
//           height: "700px",
//         }}
//       >
//         {Object.entries(remoteUsers).map(([uid, user]) => (
//           <div
//             key={uid}
//             // ID must be on the direct parent where Agora injects the video
//             id={`remote-player-${user.uid}`}
//             style={{
//               aspectRatio: "4/3", // Maintain aspect ratio for video consistency
//               position: "relative",
//               // borderRadius: "8px",
//               overflow: "hidden",
//               display: "flex", // Use flex for centering placeholder content
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               fontSize: "2em",
//               fontWeight: "bold",
//               textAlign: "center",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
//               backgroundColor: "#0c0d0f", // Ensure background for mute state
//               width: "100%",
//               height: "700px",
//             }}
//           >
//             {/* Display placeholder if remote user's video is muted */}
//             {user.videoMuted ? (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent overlay
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   zIndex: 3, // Above video element
//                 }}
//               >
//                 {/* Display remote user's initial or generic text */}
//                 {localUserInitial ? (
//                   <span style={{ fontSize: "3em" }}>{localUserInitial}</span>
//                 ) : (
//                   <span>Video Off</span> // Fallback if no initial
//                 )}
//               </div>
//             ) : (
//               <div
//                 style={{
//                   position: "absolute", // Make this fill the parent
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "#0c0d0f", // Background if video is not yet loaded
//                 }}
//               />
//             )}

//             {/* Display "Audio Off" indicator for remote user */}
//             {user.audioMuted && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "20px",
//                   right: "240px",
//                   backgroundColor: "rgba(255, 0, 0, 0.7)",
//                   color: "#fff",
//                   padding: "4px 8px",
//                   borderRadius: "4px",
//                   fontSize: "0.8em",
//                   zIndex: 4, // Above video and video off overlay
//                 }}
//               >
//                 <CiMicrophoneOff />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Local video preview (bottom right corner) */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "140px",
//           right: "20px",
//           width: "180px",
//           height: "240px", // Fixed height for local video
//           backgroundColor: "#0c0d0f",
//           borderRadius: "8px",
//           overflow: "hidden",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "#fff",
//           fontSize: "3em",
//           fontWeight: "bold",
//           zIndex: 10, // Ensure local video is on top of remote videos
//           boxShadow: "0 4px 12px rgba(0,0,0,0.6)", // Enhanced shadow
//           border: "2px solid rgba(255,255,255,0.3)", // Subtle border
//         }}
//       >
//         {isCameraOn ? (
//           // If local camera is on, render the div that Agora will play into
//           <div
//             ref={localVideoRef}
//             style={{
//               width: "100%",
//               height: "100%",
//               backgroundColor: "#222", // Background for local video container
//             }}
//           />
//         ) : (
//           <div
//             style={{
//               // position: "absolute",
//               // bottom: -20,
//               // right: 20,
//               // width: "150px",
//               // height: "200px",
//               backgroundColor: "black",
//               borderRadius: 8,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               fontSize: "48px",
//               fontWeight: "bold",
//               zIndex: 2,
//             }}
//           ></div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Video;
//

//

import React, { useEffect, useRef, useState, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useSelector } from "react-redux";

import { CiMicrophoneOff } from "react-icons/ci";

import { useLocation, useNavigate } from "react-router-dom";

const Video = ({ isCameraOn, isMuted, patientInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const localUserInitial = patientInfo
    ? patientInfo.charAt(0).toUpperCase()
    : "";
  // console.log(
  //   localUserInitial,
  //   "localUserInitiallocalUserInitiallocalUserInitial"
  // );
  // const { channelDetails } = useSelector((state) => state.appointments);
  const { channelDetails } = useSelector((state) => state.info);

  const APP_ID = channelDetails?.appId || null;
  const TOKEN = channelDetails?.token || null;
  const CHANNEL = channelDetails?.channelName || null;
  const UID = channelDetails?.uid || 0;
  const loginUser = JSON.parse(localStorage.getItem("doctor-app"));
  const loginedin = loginUser?.doctorData?.name
    ? loginUser?.doctorData?.name.charAt(0).toUpperCase()
    : "";

  // console.log("Agora Config (from Redux):", { APP_ID, TOKEN, CHANNEL, UID });

  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);
  const localVideoRef = useRef(null);

  const [remoteUsers, setRemoteUsers] = useState({});

  const getRemoteUserDetails = useCallback((remoteUid) => {
    const name = `Remote User ${remoteUid}`;
    const initial = name.charAt(0).toUpperCase();
    return { name, initial };
  }, []);

  useEffect(() => {
    if (!client.current) {
      // console.log("Creating new AgoraRTC client instance.");
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    }

    const initAgora = async () => {
      if (!APP_ID || !CHANNEL || !TOKEN) {
        console.error(
          "Agora Error: Missing APP_ID, CHANNEL, or TOKEN. Cannot join."
        );
        navigate("/doctor-home");
        return;
      }

      try {
        // console.log(`Attempting to join channel: ${CHANNEL} with UID: ${UID}`);
        await client.current.join(APP_ID, CHANNEL, TOKEN, UID);
        // console.log("Successfully joined Agora channel.");

        localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
        localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
        // console.log("Local audio and video tracks created.");

        if (localVideoRef.current) {
          localVideoTrack.current.play(localVideoRef.current);
          // console.log("Local video track playing.");
        } else {
          console.warn(
            "Local video ref is not available. Cannot play local video."
          );
        }

        await client.current.publish([
          localAudioTrack.current,
          localVideoTrack.current,
        ]);
        // console.log("Local audio and video tracks published.");

        // --- NEW CODE ADDED HERE FOR ISSUE 1 FIX ---
        // After joining, check for existing remote users and subscribe to their tracks
        client.current.remoteUsers.forEach(async (user) => {
          // console.log(`Processing existing remote user: ${user.uid}`);

          // Get remote user's display details
          const { name: remoteUserName, initial: remoteUserInitial } =
            getRemoteUserDetails(user.uid);

          setRemoteUsers((prevUsers) => ({
            ...prevUsers,
            [user.uid]: {
              ...user, // Spread Agora user object
              audioMuted: !user.hasAudio,
              videoMuted: !user.hasVideo,
              remoteDisplayName: remoteUserName,
              remoteDisplayInitial: remoteUserInitial,
            },
          }));

          // Subscribe to both audio and video if available
          if (user.hasAudio) {
            await client.current.subscribe(user, "audio");
            user.audioTrack?.play();
            // console.log(`Playing audio for existing user ${user.uid}.`);
          }
          if (user.hasVideo) {
            await client.current.subscribe(user, "video");
            const playerContainerId = `remote-player-${user.uid}`;
            setTimeout(() => {
              if (document.getElementById(playerContainerId)) {
                user.videoTrack?.play(playerContainerId);
                // console.log(
                //   `Playing video for existing user ${user.uid} in ${playerContainerId}`
                // );
                const videoElement = document
                  .getElementById(playerContainerId)
                  .querySelector("video");
                if (videoElement) {
                  videoElement.style.width = "100%";
                  videoElement.style.height = "100%";
                  videoElement.style.objectFit = "cover";
                }
              } else {
                console.warn(
                  `Video player container ${playerContainerId} not found for existing user ${user.uid}.`
                );
              }
            }, 300);
          }
        });
        // --- END OF NEW CODE ---

        // --- Agora Event Listeners (Existing code, unchanged) ---
        client.current.on("user-published", async (user, mediaType) => {
          // console.log(`User ${user.uid} published ${mediaType} track.`);
          await client.current.subscribe(user, mediaType);

          const { name: remoteUserName, initial: remoteUserInitial } =
            getRemoteUserDetails(user.uid);

          setRemoteUsers((prevUsers) => ({
            ...prevUsers,
            [user.uid]: {
              ...prevUsers[user.uid], // Keep existing data if user was already known (e.g., from existingUsers check)
              ...user,
              audioMuted: !user.hasAudio,
              videoMuted: !user.hasVideo,
              remoteDisplayName: remoteUserName,
              remoteDisplayInitial: remoteUserInitial,
            },
          }));

          if (mediaType === "video") {
            const playerContainerId = `remote-player-${user.uid}`;
            setTimeout(() => {
              if (document.getElementById(playerContainerId)) {
                user.videoTrack?.play(playerContainerId);
                // console.log(
                //   `Playing video for user ${user.uid} in ${playerContainerId}`
                // );
                const videoElement = document
                  .getElementById(playerContainerId)
                  .querySelector("video");
                if (videoElement) {
                  videoElement.style.width = "100%";
                  videoElement.style.height = "100%";
                  videoElement.style.objectFit = "cover";
                }
              } else {
                console.warn(
                  `Video player container ${playerContainerId} not found for user ${user.uid}.`
                );
              }
            }, 300);
          } else if (mediaType === "audio") {
            user.audioTrack?.play();
            // console.log(`Playing audio for user ${user.uid}.`);
          }
        });

        client.current.on("user-updated", (user, mediaType) => {
          // console.log(
          //   `User ${user.uid} updated: ${mediaType} (hasAudio: ${user.hasAudio}, hasVideo: ${user.hasVideo})`
          // );

          setRemoteUsers((prevUsers) => {
            const currentUserState = prevUsers[user.uid] || {};
            const videoStateChangedFromOffToOn =
              currentUserState.videoMuted && user.hasVideo;

            const updatedUser = {
              ...currentUserState,
              ...user,
              audioMuted: !user.hasAudio,
              videoMuted: !user.hasVideo,
            };

            if (
              mediaType === "video" &&
              user.hasVideo &&
              user.videoTrack &&
              videoStateChangedFromOffToOn
            ) {
              const playerContainerId = `remote-player-${user.uid}`;
              setTimeout(() => {
                if (document.getElementById(playerContainerId)) {
                  user.videoTrack.play(playerContainerId);
                  // console.log(
                  //   `Re-playing video for user ${user.uid} due to video state change (off to on).`
                  // );
                  const videoElement = document
                    .getElementById(playerContainerId)
                    .querySelector("video");
                  if (videoElement) {
                    videoElement.style.width = "100%";
                    videoElement.style.height = "100%";
                    videoElement.style.objectFit = "cover";
                  }
                }
              }, 300);
            }

            return {
              ...prevUsers,
              [user.uid]: updatedUser,
            };
          });
        });

        client.current.on("user-unpublished", (user, mediaType) => {
          // console.log(`User ${user.uid} unpublished ${mediaType} track.`);
          if (mediaType === "video" && user.videoTrack) {
            user.videoTrack.stop();
            // console.log(`Stopped video for user ${user.uid}.`);
          }
          setRemoteUsers((prevUsers) => {
            const updatedUsers = { ...prevUsers };
            if (updatedUsers[user.uid]) {
              if (mediaType === "audio") {
                updatedUsers[user.uid].audioMuted = true;
              } else if (mediaType === "video") {
                updatedUsers[user.uid].videoMuted = true;
              }
            }
            return updatedUsers;
          });
        });

        client.current.on("user-left", async (user) => {
          // console.log(`User ${user.uid} left the channel.`);
          setRemoteUsers((prevUsers) => {
            const updatedUsers = { ...prevUsers };
            delete updatedUsers[user.uid];
            return updatedUsers;
          });
        });
      } catch (error) {
        console.error("Agora Operation Error:", error);
      }
    };

    initAgora();

    return () => {
      // console.log("Running Agora cleanup.");
      const leaveChannel = async () => {
        if (localAudioTrack.current) {
          localAudioTrack.current.close();
          localAudioTrack.current = null;
          // console.log("Local audio track closed.");
        }
        if (localVideoTrack.current) {
          localVideoTrack.current.close();
          localVideoTrack.current = null;
          // console.log("Local video track closed.");
        }
        if (client.current && client.current.connectionState === "CONNECTED") {
          await client.current.leave();
          // console.log("Left Agora channel.");
        }
        client.current = null;
        setRemoteUsers({});
        // console.log("Agora resources cleaned up.");
      };
      leaveChannel();
    };
  }, [APP_ID, CHANNEL, TOKEN, UID, getRemoteUserDetails]);

  // --- Effects for controlling local camera and microphone (unchanged) ---
  useEffect(() => {
    if (localVideoTrack.current) {
      // console.log(`Setting local camera to: ${isCameraOn ? "On" : "Off"}`);
      localVideoTrack.current.setEnabled(isCameraOn);
    }
  }, [isCameraOn]);

  useEffect(() => {
    if (localAudioTrack.current) {
      // console.log(
      //   `Setting local microphone to: ${isMuted ? "Muted" : "Unmuted"}`
      // );
      localAudioTrack.current.setEnabled(!isMuted);
    }
  }, [isMuted]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "580px",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Remote videos container */}
      <div
        id="remote-video-grid-container"
        style={{
          flexGrow: 1,
          backgroundColor: "#0c0d0f",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          // gap: "10px",
          overflowY: "auto",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          height: "580px",
        }}
      >
        {Object.entries(remoteUsers).map(([uid, user]) => (
          <div
            key={uid}
            id={`remote-player-${user.uid}`}
            style={{
              aspectRatio: "4/3",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "2em",
              fontWeight: "bold",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              backgroundColor: "#0c0d0f",
              width: "100%",
              height: "580px",
            }}
          >
            {user.videoMuted ? (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
              >
                {/* Use the remote user's initial here, not localUserInitial */}
                {localUserInitial ? (
                  <span style={{ fontSize: "3em" }}>{localUserInitial}</span>
                ) : (
                  <span>Video Off</span>
                )}
              </div>
            ) : (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#0c0d0f",
                }}
              />
            )}

            {user.audioMuted && (
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "240px",
                  backgroundColor: "rgba(255, 0, 0, 0.7)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.8em",
                  zIndex: 4,
                }}
              >
                <CiMicrophoneOff />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Local video preview (bottom right corner) */}
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          right: "20px",
          width: "180px",
          height: "240px",
          backgroundColor: "#0c0d0f",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "3em",
          fontWeight: "bold",
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
          border: "2px solid rgba(255,255,255,0.3)",
        }}
      >
        {isCameraOn ? (
          <div
            ref={localVideoRef}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#222",
            }}
          />
        ) : (
          <div
            style={{
              // backgroundColor: "black",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "48px",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            {/* Display local user's initial when camera is off */}
            {loginedin && <span style={{ fontSize: "1em" }}>{loginedin}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;

