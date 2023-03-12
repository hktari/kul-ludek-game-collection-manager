import { https } from "follow-redirects";

export function getContentAtUrl(url: URL): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    https
      .get(url, (res) => {
        let data: any = [];
        const headerDate =
          res.headers && res.headers.date
            ? res.headers.date
            : "no response date";

        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          const contentString = Buffer.concat(data).toString();
          resolve(contentString);
        });
      })
      .on("error", (err) => {
        // todo: log errors
        console.error("Error: ", err.message);
        reject(err);
      });
  });
}

