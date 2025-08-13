// import React from "react";

// const Footer = () => {
//   return (
//     <div className="panel-footer">
//       <div className="copyright">
//         <p>&copy; <span className="curryr"></span> . All rights reserved.</p>
//       </div>
//       <div className="ftr-right">
//         <p>
//           Design & Developed with <i className="fa-solid fa-heart"></i> by
//           <a href="https://yesitlabs.com"> Yes IT Labs</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Footer;

import React from "react";

const Footer = () => {
  return (
    <div className="panel-footer">
      <div className="copyright">
        <p>
          &copy; <span className="curryr">{new Date().getFullYear()}</span> .
          All rights reserved.
        </p>
      </div>
      <div className="ftr-right">
        {/* <p>
          Design & Developed with <i className="fa-solid fa-heart"></i> by{" "}
          <a href="https://yesitlabs.com" target="_blank" rel="noopener noreferrer">Yes IT Labs</a>
        </p> */}
      </div>
    </div>
  );
};

export default Footer;
