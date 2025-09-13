// message.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Snackbar, Alert } from '@mui/material';

// type MessageType = "success" | "error" | "info" | "warning";

function showMessage(type, text, duration = 2000) {
  // 动态创建容器
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);

  const handleClose = () => {
    root.unmount();
    container.remove();
  };

  root.render(
      <Snackbar
          open
          autoHideDuration={duration}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={type} onClose={handleClose} sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
  );
}

export const message = {
    success: (text, duration = 1000) => showMessage("success", text, duration),
    error: (text, duration = 1000) => showMessage("error", text, duration),
    info: (text, duration = 1000) => showMessage("info", text, duration),
    warning: (text, duration = 1000) => showMessage("warning", text, duration),
};
