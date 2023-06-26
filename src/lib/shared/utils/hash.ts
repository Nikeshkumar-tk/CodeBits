import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const hashedPassWord = await bcrypt.hash(password, 10);
  return hashedPassWord
}

export async function decodePassword(encodedPassword:string, inputPassword:string){
    const isVerified = await bcrypt.compare(inputPassword, encodedPassword)
    return isVerified
}
