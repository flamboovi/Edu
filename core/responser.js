{
    status: "error",
    message: messageCode
          ? getMessage(handler, req.headers.locale || "en", messageCode)
          : "Unknown Error",
    messageCode
    }
    