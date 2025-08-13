import React from 'react';
import GlobalReminderModal from './doctorPanel/GlobalReminderModal';
const Layout = ({ children }) => {
  return (
    <div > 
      <GlobalReminderModal/>
     
      <main>{children}</main>
    
    </div>
  );
};

export default Layout;
