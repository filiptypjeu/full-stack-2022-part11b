const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="message notification">{message}</div>;
};

export default Notification;
