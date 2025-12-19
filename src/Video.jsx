import React, { useEffect, useRef, useState, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useSelector } from "react-redux";

import { CiMicrophoneOff } from "react-icons/ci";
// New imports for the speaker icon
import {
  PiSpeakerSimpleHighFill,
  PiSpeakerSimpleSlashFill,
} from "react-icons/pi";

import { useLocation, useNavigate } from "react-router-dom";

const Video = ({
  isCameraOn,
  isMuted,
  patientInfo,
  remoteAudioOn,
  ObjNavigate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const localUserInitial = patientInfo
    ? patientInfo.charAt(0).toUpperCase()
    : "";

  const { channelDetails } = useSelector((state) => state.info);
  const { invitedUser } = useSelector(({ info }) => info);

  const APP_ID =
    channelDetails?.appId || invitedUser?.appId || ObjNavigate?.AppID;
  const TOKEN =
    channelDetails?.token || invitedUser?.token || ObjNavigate?.Token;
  const CHANNEL =
    channelDetails?.channelName ||
    invitedUser?.channelName ||
    ObjNavigate?.ChName;
  const UID = channelDetails?.uid || invitedUser?.uid || ObjNavigate?.UDID;
  const loginUser = JSON.parse(localStorage.getItem("doctor-app"));
  const loginedin = loginUser?.doctorData?.name
    ? loginUser?.doctorData?.name.charAt(0).toUpperCase()
    : "";

  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);
  const localVideoRef = useRef(null);

  const [remoteUsers, setRemoteUsers] = useState({});
  // State to track the global status of remote audio volume
  // const [remoteAudioOn, setRemoteAudioOn] = useState(false);

  // remote audio toggle effect

  const getRemoteUserDetails = useCallback((remoteUid) => {
    const name = `Remote User ${remoteUid}`;
    const initial = name.charAt(0).toUpperCase();
    return { name, initial };
  }, []);

  useEffect(() => {
    if (!client.current) {
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
        await client.current.join(APP_ID, CHANNEL, TOKEN, UID);

        localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
        localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

        if (localVideoRef.current) {
          localVideoTrack.current.play(localVideoRef.current);
        } else {
          console.warn(
            "Local video ref is not available. Cannot play local video."
          );
        }

        await client.current.publish([
          localAudioTrack.current,
          localVideoTrack.current,
        ]);

        // After joining, check for existing remote users and subscribe to their tracks
        client.current.remoteUsers.forEach(async (user) => {
          const { name: remoteUserName, initial: remoteUserInitial } =
            getRemoteUserDetails(user.uid);

          setRemoteUsers((prevUsers) => ({
            ...prevUsers,
            [user.uid]: {
              ...user,
              audioMuted: !user.hasAudio,
              videoMuted: !user.hasVideo,
              remoteDisplayName: remoteUserName,
              remoteDisplayInitial: remoteUserInitial,
            },
          }));

          if (user.hasAudio) {
            await client.current.subscribe(user, "audio");
            user.audioTrack?.play();
            // Apply volume state to existing user
            if (!remoteAudioOn && user.audioTrack) {
              user.audioTrack.setVolume(0);
            }
          }
          if (user.hasVideo) {
            await client.current.subscribe(user, "video");
            const playerContainerId = `remote-player-${user.uid}`;
            setTimeout(() => {
              if (document.getElementById(playerContainerId)) {
                user.videoTrack?.play(playerContainerId);
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
        });

        // --- Agora Event Listeners ---
        client.current.on("user-published", async (user, mediaType) => {
          await client.current.subscribe(user, mediaType);

          const { name: remoteUserName, initial: remoteUserInitial } =
            getRemoteUserDetails(user.uid);

          setRemoteUsers((prevUsers) => ({
            ...prevUsers,
            [user.uid]: {
              ...prevUsers[user.uid],
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
          } else if (mediaType === "audio") {
            user.audioTrack?.play();
            // --- MODIFICATION: Apply current volume state to new user ---
            if (!remoteAudioOn && user.audioTrack) {
              user.audioTrack.setVolume(0); // Mute if global remote audio is off
            }
            // --- END MODIFICATION ---
          }
        });

        client.current.on("user-updated", (user, mediaType) => {
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
          if (mediaType === "video" && user.videoTrack) {
            user.videoTrack.stop();
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
      const leaveChannel = async () => {
        if (localAudioTrack.current) {
          localAudioTrack.current.close();
          localAudioTrack.current = null;
        }
        if (localVideoTrack.current) {
          localVideoTrack.current.close();
          localVideoTrack.current = null;
        }
        if (client.current && client.current.connectionState === "CONNECTED") {
          await client.current.leave();
        }
        client.current = null;
        setRemoteUsers({});
      };
      leaveChannel();
    };
  }, [APP_ID, CHANNEL, TOKEN, UID, getRemoteUserDetails]); // Depend on remoteAudioOn to apply initial volume state

  // --- Effects for controlling local camera and microphone (unchanged) ---
  useEffect(() => {
    if (localVideoTrack.current) {
      localVideoTrack.current.setEnabled(isCameraOn);
    }
  }, [isCameraOn]);

  useEffect(() => {
    if (localAudioTrack.current) {
      localAudioTrack.current.setEnabled(!isMuted);
    }
  }, [isMuted]);

  // useEffect(() => {
  //   if (!client.current) return;

  //   client.current.remoteUsers.forEach((agoraUser) => {
  //     const track = agoraUser.audioTrack;
  //     if (!track) return;

  //     if (remoteAudioOn) {
  //       track.setVolume ? track.setVolume(100) : track.play?.();
  //     } else {
  //       track.setVolume ? track.setVolume(50) : track.stop?.();
  //     }
  //   });
  // }, [remoteAudioOn]);

  useEffect(() => {
    if (!client.current) return;

    client.current.remoteUsers.forEach((agoraUser) => {
      const track = agoraUser.audioTrack;
      if (!track) return;

      if (remoteAudioOn) {
        track.setVolume?.(100); // FULL volume
      } else {
        track.setVolume?.(50); // LOW volume
      }
    });
  }, [remoteAudioOn]);

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
                {/* Use the remote user's initial here */}
                {/* Note: I'm using localUserInitial which seems to be the Patient's initial, 
                    but maybe you intend to use the remote user's initial. 
                    I'm keeping it as patientInfo's initial for now, which is common in doctor apps. */}
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

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useSelector } from "react-redux";

// import { CiMicrophoneOff } from "react-icons/ci";

// import { useLocation, useNavigate } from "react-router-dom";

// const Video = ({ isCameraOn, isMuted, patientInfo }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const localUserInitial = patientInfo
//     ? patientInfo.charAt(0).toUpperCase()
//     : "";

//   const { channelDetails } = useSelector((state) => state.info);

//   const APP_ID = channelDetails?.appId || null;
//   const TOKEN = channelDetails?.token || null;
//   const CHANNEL = channelDetails?.channelName || null;
//   const UID = channelDetails?.uid || 0;
//   const loginUser = JSON.parse(localStorage.getItem("doctor-app"));
//   const loginedin = loginUser?.doctorData?.name
//     ? loginUser?.doctorData?.name.charAt(0).toUpperCase()
//     : "";

//   // console.log("Agora Config (from Redux):", { APP_ID, TOKEN, CHANNEL, UID });

//   const client = useRef(null);
//   const localAudioTrack = useRef(null);
//   const localVideoTrack = useRef(null);
//   const localVideoRef = useRef(null);

//   const [remoteUsers, setRemoteUsers] = useState({});

//   const getRemoteUserDetails = useCallback((remoteUid) => {
//     const name = `Remote User ${remoteUid}`;
//     const initial = name.charAt(0).toUpperCase();
//     return { name, initial };
//   }, []);

//   useEffect(() => {
//     if (!client.current) {
//       // console.log("Creating new AgoraRTC client instance.");
//       client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//     }

//     const initAgora = async () => {
//       if (!APP_ID || !CHANNEL || !TOKEN) {
//         console.error(
//           "Agora Error: Missing APP_ID, CHANNEL, or TOKEN. Cannot join."
//         );
//         navigate("/doctor-home");
//         return;
//       }

//       try {
//         // console.log(`Attempting to join channel: ${CHANNEL} with UID: ${UID}`);
//         await client.current.join(APP_ID, CHANNEL, TOKEN, UID);
//         // console.log("Successfully joined Agora channel.");

//         localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
//         localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
//         // console.log("Local audio and video tracks created.");

//         if (localVideoRef.current) {
//           localVideoTrack.current.play(localVideoRef.current);
//           // console.log("Local video track playing.");
//         } else {
//           console.warn(
//             "Local video ref is not available. Cannot play local video."
//           );
//         }

//         await client.current.publish([
//           localAudioTrack.current,
//           localVideoTrack.current,
//         ]);
//         // console.log("Local audio and video tracks published.");

//         // --- NEW CODE ADDED HERE FOR ISSUE 1 FIX ---
//         // After joining, check for existing remote users and subscribe to their tracks
//         client.current.remoteUsers.forEach(async (user) => {
//           // console.log(`Processing existing remote user: ${user.uid}`);

//           // Get remote user's display details
//           const { name: remoteUserName, initial: remoteUserInitial } =
//             getRemoteUserDetails(user.uid);

//           setRemoteUsers((prevUsers) => ({
//             ...prevUsers,
//             [user.uid]: {
//               ...user, // Spread Agora user object
//               audioMuted: !user.hasAudio,
//               videoMuted: !user.hasVideo,
//               remoteDisplayName: remoteUserName,
//               remoteDisplayInitial: remoteUserInitial,
//             },
//           }));

//           // Subscribe to both audio and video if available
//           if (user.hasAudio) {
//             await client.current.subscribe(user, "audio");
//             user.audioTrack?.play();
//             // console.log(`Playing audio for existing user ${user.uid}.`);
//           }
//           if (user.hasVideo) {
//             await client.current.subscribe(user, "video");
//             const playerContainerId = `remote-player-${user.uid}`;
//             setTimeout(() => {
//               if (document.getElementById(playerContainerId)) {
//                 user.videoTrack?.play(playerContainerId);
//                 // console.log(
//                 //   `Playing video for existing user ${user.uid} in ${playerContainerId}`
//                 // );
//                 const videoElement = document
//                   .getElementById(playerContainerId)
//                   .querySelector("video");
//                 if (videoElement) {
//                   videoElement.style.width = "100%";
//                   videoElement.style.height = "100%";
//                   videoElement.style.objectFit = "cover";
//                 }
//               } else {
//                 console.warn(
//                   `Video player container ${playerContainerId} not found for existing user ${user.uid}.`
//                 );
//               }
//             }, 300);
//           }
//         });
//         // --- END OF NEW CODE ---

//         // --- Agora Event Listeners (Existing code, unchanged) ---
//         client.current.on("user-published", async (user, mediaType) => {
//           // console.log(`User ${user.uid} published ${mediaType} track.`);
//           await client.current.subscribe(user, mediaType);

//           const { name: remoteUserName, initial: remoteUserInitial } =
//             getRemoteUserDetails(user.uid);

//           setRemoteUsers((prevUsers) => ({
//             ...prevUsers,
//             [user.uid]: {
//               ...prevUsers[user.uid], // Keep existing data if user was already known (e.g., from existingUsers check)
//               ...user,
//               audioMuted: !user.hasAudio,
//               videoMuted: !user.hasVideo,
//               remoteDisplayName: remoteUserName,
//               remoteDisplayInitial: remoteUserInitial,
//             },
//           }));

//           if (mediaType === "video") {
//             const playerContainerId = `remote-player-${user.uid}`;
//             setTimeout(() => {
//               if (document.getElementById(playerContainerId)) {
//                 user.videoTrack?.play(playerContainerId);
//                 // console.log(
//                 //   `Playing video for user ${user.uid} in ${playerContainerId}`
//                 // );
//                 const videoElement = document
//                   .getElementById(playerContainerId)
//                   .querySelector("video");
//                 if (videoElement) {
//                   videoElement.style.width = "100%";
//                   videoElement.style.height = "100%";
//                   videoElement.style.objectFit = "cover";
//                 }
//               } else {
//                 console.warn(
//                   `Video player container ${playerContainerId} not found for user ${user.uid}.`
//                 );
//               }
//             }, 300);
//           } else if (mediaType === "audio") {
//             user.audioTrack?.play();
//             // console.log(`Playing audio for user ${user.uid}.`);
//           }
//         });

//         client.current.on("user-updated", (user, mediaType) => {
//           // console.log(
//           //   `User ${user.uid} updated: ${mediaType} (hasAudio: ${user.hasAudio}, hasVideo: ${user.hasVideo})`
//           // );

//           setRemoteUsers((prevUsers) => {
//             const currentUserState = prevUsers[user.uid] || {};
//             const videoStateChangedFromOffToOn =
//               currentUserState.videoMuted && user.hasVideo;

//             const updatedUser = {
//               ...currentUserState,
//               ...user,
//               audioMuted: !user.hasAudio,
//               videoMuted: !user.hasVideo,
//             };

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
//                   // console.log(
//                   //   `Re-playing video for user ${user.uid} due to video state change (off to on).`
//                   // );
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

//         client.current.on("user-unpublished", (user, mediaType) => {
//           // console.log(`User ${user.uid} unpublished ${mediaType} track.`);
//           if (mediaType === "video" && user.videoTrack) {
//             user.videoTrack.stop();
//             // console.log(`Stopped video for user ${user.uid}.`);
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

//         client.current.on("user-left", async (user) => {
//           // console.log(`User ${user.uid} left the channel.`);
//           setRemoteUsers((prevUsers) => {
//             const updatedUsers = { ...prevUsers };
//             delete updatedUsers[user.uid];
//             return updatedUsers;
//           });
//         });
//       } catch (error) {
//         console.error("Agora Operation Error:", error);
//       }
//     };

//     initAgora();

//     return () => {
//       // console.log("Running Agora cleanup.");
//       const leaveChannel = async () => {
//         if (localAudioTrack.current) {
//           localAudioTrack.current.close();
//           localAudioTrack.current = null;
//           // console.log("Local audio track closed.");
//         }
//         if (localVideoTrack.current) {
//           localVideoTrack.current.close();
//           localVideoTrack.current = null;
//           // console.log("Local video track closed.");
//         }
//         if (client.current && client.current.connectionState === "CONNECTED") {
//           await client.current.leave();
//           // console.log("Left Agora channel.");
//         }
//         client.current = null;
//         setRemoteUsers({});
//         // console.log("Agora resources cleaned up.");
//       };
//       leaveChannel();
//     };
//   }, [APP_ID, CHANNEL, TOKEN, UID, getRemoteUserDetails]);

//   // --- Effects for controlling local camera and microphone (unchanged) ---
//   useEffect(() => {
//     if (localVideoTrack.current) {
//       // console.log(`Setting local camera to: ${isCameraOn ? "On" : "Off"}`);
//       localVideoTrack.current.setEnabled(isCameraOn);
//     }
//   }, [isCameraOn]);

//   useEffect(() => {
//     if (localAudioTrack.current) {
//       // console.log(
//       //   `Setting local microphone to: ${isMuted ? "Muted" : "Unmuted"}`
//       // );
//       localAudioTrack.current.setEnabled(!isMuted);
//     }
//   }, [isMuted]);

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100%",
//         height: "580px",
//         backgroundColor: "#000",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       {/* Remote videos container */}
//       <div
//         id="remote-video-grid-container"
//         style={{
//           flexGrow: 1,
//           backgroundColor: "#0c0d0f",
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//           gap: "10px",
//           overflowY: "auto",
//           justifyContent: "center",
//           alignContent: "center",
//           width: "100%",
//           height: "580px",
//         }}
//       >
//         {Object.entries(remoteUsers).map(([uid, user]) => (
//           <div
//             key={uid}
//             id={`remote-player-${user.uid}`}
//             style={{
//               aspectRatio: "4/3",
//               position: "relative",
//               overflow: "hidden",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               fontSize: "2em",
//               fontWeight: "bold",
//               textAlign: "center",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
//               backgroundColor: "#0c0d0f",
//               width: "100%",
//               height: "580px",
//             }}
//           >
//             {user.videoMuted ? (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "rgba(0, 0, 0, 0.7)",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   zIndex: 3,
//                 }}
//               >
//                 {/* Use the remote user's initial here, not localUserInitial */}
//                 {localUserInitial ? (
//                   <span style={{ fontSize: "3em" }}>{localUserInitial}</span>
//                 ) : (
//                   <span>Video Off</span>
//                 )}
//               </div>
//             ) : (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "#0c0d0f",
//                 }}
//               />
//             )}

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
//                   zIndex: 4,
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
//           bottom: "120px",
//           right: "20px",
//           width: "180px",
//           height: "240px",
//           backgroundColor: "#0c0d0f",
//           borderRadius: "8px",
//           overflow: "hidden",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "#fff",
//           fontSize: "3em",
//           fontWeight: "bold",
//           zIndex: 10,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
//           border: "2px solid rgba(255,255,255,0.3)",
//         }}
//       >
//         {isCameraOn ? (
//           <div
//             ref={localVideoRef}
//             style={{
//               width: "100%",
//               height: "100%",
//               backgroundColor: "#222",
//             }}
//           />
//         ) : (
//           <div
//             style={{
//               // backgroundColor: "black",
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
//             {/* Display local user's initial when camera is off */}
//             {loginedin && <span style={{ fontSize: "1em" }}>{loginedin}</span>}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Video;
