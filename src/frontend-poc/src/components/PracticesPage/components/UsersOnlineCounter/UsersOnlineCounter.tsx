import React from "react";
import "./UsersOnlineCounter.css";

interface UsersOnlineCounterProps {
  currentlyOnlineUsers: number;
}

export const UsersOnlineCounter: React.FC<UsersOnlineCounterProps> = ({
  currentlyOnlineUsers,
}) => {
  console.log(
    "UsersOnlineCounter rendered with currentlyOnlineUsers: " +
      currentlyOnlineUsers
  );

  return (
    <div className="users-online-counter">
      <span className="label">Users Online: </span>
      <span className="online-count">{currentlyOnlineUsers}</span>
    </div>
  );
};
