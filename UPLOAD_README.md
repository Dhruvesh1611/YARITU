AWS S3 server upload setup

This project uses AWS S3 for server-side uploads via the server routes (e.g. `app/api/upload/route.js`). The server uses the AWS SDK (@aws-sdk/client-s3) to upload incoming files to the configured S3 bucket and returns a public URL of the form:

```
https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/<file-key>
```

Required environment variables (add to `.env.local` or your host's secret manager):

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- AWS_S3_BUCKET_NAME

Example `.env.local` (do not commit):

```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=my-yaritu-bucket
```

Install dependencies and run dev server:

```
# from frontend folder
npm install
npm run dev
```

Notes:
- The server accepts files up to 150MB; adjust client-side limits as needed.
- The server stores uploads at the bucket root (object keys are prefixed with a timestamp to reduce collisions).
- Remove any Cloudinary-related environment variables (CLOUDINARY_*) from your local `.env.local` or Vercel project settings.
