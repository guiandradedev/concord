package com.concord.application.exception;

public class PublishException extends Exception{

    public PublishException(String message) {
        // Considerada rota com erro 500 (Internal Server Error), logo não possui handler próprio, será tratada pelo handler genérico de Exception
        super(message);
    }

    public PublishException(String message, Exception cause) {
        // Considerada rota com erro 500 (Internal Server Error), logo não possui handler próprio, será tratada pelo handler genérico de Exception
        super(message, cause);
    }
}