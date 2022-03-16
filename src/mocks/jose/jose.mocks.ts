import { IJose } from "@app/interfaces/ijose";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";
import { JWK } from "node-jose";

export const PublicKeySpy = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA53/Dr14Mtna+83HxUQPg
xo/VrX5Jn9QpgeGkQnc6n0VOCWkqh0g8ltikiHUGRk1UurFu80i4XfCHoqyOPS7e
cOm45NM9uPqPwj+FAQ0UY0MgtrP18aUKoFnzhW1ZLtTohmD/Bd5XTPNlTV0YnPjS
f1Uz3UicOEltv++MIRCAz3T1Dp8/t2Sztfk4QpmoBc/+UoTKAKX8Jm14se+R/VcS
jIsmWDPiME09hqwkB5sYKLIY7f+ZZaPONxy2l41xQylhe9JdhysYaFs2INuFqpPM
DsJ4yoIdUh8eRTxfkr6iQV/ZbjQFGTtmjSn4kBylppgOPeYjtDV/7Dv+kQO+Bde2
gwYc5EavOLSuUwd1FDOfJqyFj+GSEl9CkPNxRttUoh4S46K7AnAfGztFY7vL72LB
IWyKw2Xb/tsX7yEfM6lqVtjuLC+ELZO8z2Ig3pUVitICz0RyMqaAKbp6VAe6mZ5/
00ToYPGMdJ32SHXutamd15/f+tYfBWYaCDqA65cdsOO5dSLfJPcv9Kd9VM2My7fX
lyG9ztdcL0/paIESvU7QxTLl1wBPjqdpbqMrsfjwtRFZ7j864K+/DmwJsFcmRW+z
cfF/xkbLC3kuljWXYqxzdd12v03ARQl/1rW+hnGPXJnuuIXzRZBB3Ml5f5N07ZTi
taCW8teGTuLrJ1MVodH6omcCAwEAAQ==
-----END PUBLIC KEY-----
`;

export const PrivateKeySpy = `-----BEGIN PRIVATE KEY-----
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
eGZ9UiD+lbPcPGN5bFuloPTN8c9wVQ==
-----END PRIVATE KEY-----
`;

export const rawToBeEncryptedSpy = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzYTIyMWU4LWI2ZjUtNGI1Yy05YWMzLTAwY2NhZWQ1YzZjNCIsImZpcnN0TmFtZSI6IkJhdGF0YTIiLCJsYXN0TmFtZSI6ImVtYWlsIiwiYWNjb3VudE51bWJlciI6MTU4MjAzLCJhY2NvdW50RGlnaXQiOjk0LCJ3YWxsZXQiOjEsImVtYWlsIjoiYmF0YXRhMkBtYWlsLmNvbSIsImlhdCI6MTYzOTY3Mjk4NCwiZXhwIjoxNjM5NzAxNzg0LCJzdWIiOiIxM2EyMjFlOC1iNmY1LTRiNWMtOWFjMy0wMGNjYWVkNWM2YzQifQ.sJq3gKCmx7dqzmDboX3TbwvXoqIXiHgTbNTWZimRiVc';
export const rawEncryptedSpy = 'eyJyZWNpcGllbnRzIjpbeyJlbmNyeXB0ZWRfa2V5IjoiUXo3MW40OXIxLXVIM2k0YVJhUzN4djdLUk8zZnh2ZC1UMUI0NXBqUHIwcEFHR2JZLUJZd0h4WnI5WEFiQlpieVUxRll0S3pINTc1SGZ1dXE5NzJqVHBoRkt1ODNRd2QwRUg0cEEwY2hrWDVBc3VhRXlDMTU2eG5TYWxwS0Qxck82N3N2M3lIbkxyVmlUdHFkWEVnYm1GcmFxclpfdmZyS1J3RnVuVGVYSnpMUDhtbHUwbXU5Z1diY1EzVkZlMVdLSHJuMW1MVjZ6bUZaSTN1ZTRjVm9YbGZJdGxXTVFHS1hpcHZZazRZcFhuam5MMk9lWG52dE9Tb2hBdWtvNEllVWk5VG1QOVJaeG9PZ2o3a19JZlV2X1FqUVhab1gzdUdGVU1JUno2aG5KdVhDV0U1ZEdnSjNDTmc1eU9uemhmY1hHZGNKd0JyYllCbm1XbXNJTm5XUW9ZOFNFMTkwX2dyVl92bnZUa2ZFWnR6VDl1cXQ3Qno4SGkzWWFrS1B0dnIxb0dGckJnS0swTDlVMTd5d0NSOFNUNV9GUGxrM0wyYXl1bW1wZWJZdFlVSW10RXNscTdGZ3ppai11UUpFWEwyMXhWaGZWbnZ1NVNkMGlrWU9VTnVQdVFQeFcwbkZpU3Nmc0t4RUF5cVczQnpRRWIwWmp0SG1VZzFTalZybndJQ2tlZ2FZeWRFOE8wTXlOQ2kxSUhTQm8tVmgzVVNnRnE5R3JMUWFZMHFSU0ZsN0FiZ1UzV3h0RjRHcWVaUVBIdWQxMlZ3RUlLS2dUdWU5U1oxbTlMdkZGeUVZcmdMa3dYampma0ZXV1o3dUhYUUZhZlI4QjhIOHlhOVBjQUdVYnRYZ0tlRUM3MlpQZWtTVFhCSm5XZjdJWlhIS2x1Y01BLUFXcnMyeWRjSl94dXMifV0sInByb3RlY3RlZCI6ImV5SmxibU1pT2lKQk1USTRRMEpETFVoVE1qVTJJaXdpWVd4bklqb2lVbE5CTFU5QlJWQWlMQ0pyYVdRaU9pSmtSV1ZDWDA1eE5EbDRlVkppZG1Jd1lVWmthbTUwVjNSc2FHWnBhRTlLZUU1ak5XNURXbm96YnpGbkluMCIsIml2IjoiTXFmelRPcmgydnpJSXVKOUo5dlVWdyIsImNpcGhlcnRleHQiOiJWVFBQMVAzWEZIdEpaMnhmN0IyMTE0ZUR5X1ZpLUxDcXZTcFJYSEVEa3MyNG0wbUxNU3paNG04STNWX19QQnNrcXpwdU9vU0lOMXd1UGtNbDVGWFJoNHdMSzlXMGQ0d3ZzeGpXZnozOFFwSTJHUlN1WllZV0NfVXlBbVExajVVWGh2a0ppUURVZlU4N291WHdhY3F3cmxUSm0tYVNGcUstc09yMFctYlEtT1NtU0JfYUpQM2EzQ0NXQXk4d3ZDLTMxYjVWR1JzZVlkS2taZEI5ekpaUkg0RlkwRXpocW1SSzdaTy1rZTlvamxKMXJNZi1sOXcyZFJvWF9xNkxEUnRab3JHbG03TXpPZE81bUhha1pTYmk0c3pKU3Z2SFlsTkNad2x5X2lkd2RmeUsyMkRBWEt0MU5ORWdYUE9YcWd1UTRubEZwRzVleUItdWpmS2NHZ2VBQWpuMjlSbHFYQXRUaGpvQkNLR2RDa1lmaW92dXlES1phSGpJTUVPOUt3V0ZyRjZFMVRDcHVxaUp4Q0J5S2tEVVdGVkdOQ196SXFXRjRHN2JsVFBUeHpzRFIwMGRnX0x1WTVGQlo5eWQtckNHQnVzVUdSdFNIeFV6dWI4dG9yQnEwVl9zbTJKN0l2RVh5WUtETTVFeDd5Q0xzbGVZdTJ5X0ExbDloR1g5S3BpYnVyQnhER2drRS0xWUc5Q2JQWDJMYzFCVk9Pcm02SVRBOGQzeVVYYk82dk0iLCJ0YWciOiJGdTlmd3NqV1JBN1dSdGpCaEZ4QWNRIn0=';

export const publicJWKeySpy = async () => await JWK.asKey(PublicKeySpy, 'pem');
export const privateJWKeySpy = async () => await JWK.asKey(PrivateKeySpy, 'pem');

export const joseSpy: IJose = {
  encrypt: (_raw: string, _publicKey: JWK.Key): Promise<Either<BaseError, string>> => jest.fn as any,
  decrypt: (_encrypted: string, _privateKey: JWK.Key): Promise<Either<BaseError, string>> => jest.fn as any
};

export const jwtValidatedSpy = {"accountDigit": 94, "accountNumber": 158203, "email": "batata2@mail.com", "exp": 1639701784, "firstName": "Batata2", "iat": 1639672984, "id": "13a221e8-b6f5-4b5c-9ac3-00ccaed5c6c4", "lastName": "email", "sub": "13a221e8-b6f5-4b5c-9ac3-00ccaed5c6c4", "wallet": 1};