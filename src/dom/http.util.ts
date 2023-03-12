import https from "https";

export function getContentAtUrl(url: URL): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    https
      .get(url, (res) => {
        let data: any = [];
        const headerDate =
          res.headers && res.headers.date
            ? res.headers.date
            : "no response date";
        console.log("Status Code:", res.statusCode);
        console.log("Date in Response header:", headerDate);

        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          console.log("Response ended: ");
          const contentString = Buffer.concat(data).toString();
          resolve(contentString);
        });
      })
      .on("error", (err) => {
        // todo: log errors
        console.log("Error: ", err.message);
        reject(err);
      });
  });
}
