const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1', // usa tu región real
  // En EC2, usa IAM Role; en local puedes usar AWS_ACCESS_KEY_ID/SECRET en .env
});

async function presignPut({ bucket, key, contentType }) {
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  return getSignedUrl(s3, cmd, { expiresIn: 60 }); // 60s
}

async function presignGet({ bucket, key }) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: 60 }); // 60s
}

module.exports = { s3, presignPut, presignGet };
