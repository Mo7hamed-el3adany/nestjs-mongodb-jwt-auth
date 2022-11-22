import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ENV } from '../enums/env.enum';

@Injectable()
export class PasswordHelper {
  constructor(private readonly config: ConfigService) {}

  async secure(password: string): Promise<string> {
    const digestedPassword = await this.digest(password);
    const hashedPassword = await hash(digestedPassword, { type: 1 });
    const encryptedPassword = await this.encrypt(hashedPassword);
    return encryptedPassword;
  }

  async validate(given: string, expected: string): Promise<boolean> {
    const expectedHash = await this.decrypt(expected);
    const digestedPassword = await this.digest(given);
    return verify(expectedHash, digestedPassword, { type: 1 });
  }

  async digest(password: string): Promise<string> {
    return createHash('sha256')
      .update(password)
      .digest('base64');
  }

  async encrypt(hashedPassword: string): Promise<string> {
    const iv = randomBytes(16);
    const key = this.config.get(ENV.PASSWORD_SECRET);

    const cipher = await createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encryptedPassword = await cipher.update(hashedPassword, 'utf8');
    encryptedPassword = Buffer.concat([encryptedPassword, cipher.final()]);
    const encryptedPasswordiv = `${iv.toString('hex')}:${encryptedPassword.toString('hex')}`;
    return encryptedPasswordiv;
  }

  async decrypt(encryptedPassword: string): Promise<string> {
    const key = this.config.get(ENV.PASSWORD_SECRET);

    const password = encryptedPassword.split(':');
    const iv = Buffer.from(password.shift(), 'hex');
    const encrypted = Buffer.from(password.join(':'), 'hex');

    const decipher = await createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = await decipher.update(encrypted.toString('hex'), 'hex');

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  }
}
