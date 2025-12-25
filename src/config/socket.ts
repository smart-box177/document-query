import { io, Socket } from "socket.io-client";
import { API_URL } from "@/constants";

class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect(): Socket {
    if (!this.socket) {
      // Get auth token from localStorage
      const token = localStorage.getItem("accessToken");

      this.socket = io(API_URL, {
        withCredentials: true,
        auth: {
          token: token || undefined,
        },
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }
    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Reconnect with fresh token (call after login)
  public reconnect(): Socket {
    this.disconnect();
    return this.connect();
  }
}

export const socketClient = SocketClient.getInstance();
export const getSocket = () => socketClient.connect();
