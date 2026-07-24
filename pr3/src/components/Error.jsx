// ErrorMessage.jsx

function ErrorMessage({ message }) {
  return (
    <div style={{ color: "red", textAlign: "center" }}>
      <h3>Error</h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;