import axios, { AxiosError } from "axios";

import iconv from "iconv-lite";

export class Scraper {
  constructor(
    public readonly url: string,
    public readonly charset: string = "utf-8"
  ) {
    console.log("CONSTRUCTOR RAN");
  }

  private async fetchData() {
    try {
      const response = await axios.get(this.url, {
        timeout: 30000,
        responseEncoding: "utf-8",
        responseType: "arraybuffer",
        headers: {
          "Accept-Charset": "utf-8",
          "User-Agent": "Mozilla/5.0 (compatible; WebScraper/1.0)",
        },
      });

      const decoded = iconv.decode(Buffer.from(response.data), this.charset);
      return decoded;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const axiosError = e as AxiosError;

        if (axiosError.response) {
          console.error("Server error: ", {
            status: axiosError.status,
            data: axiosError.response.data,
            message: axiosError.message,
          });
        } else if (axiosError.request) {
          console.error("Network error - no response:", axiosError.message);
        } else {
          console.error("Request setup error:", axiosError.message);
        }
      }
      console.error("Unexpected error: ", e);
    }
    return null;
  }

  public async readData() {
    return await this.fetchData();
  }
}
