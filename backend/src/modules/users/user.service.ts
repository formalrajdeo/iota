import User from "./user.model";

export const createUser = async ({
  id,
  name,
  email,
  password,
  isAdmin,
}: any) => {
  const result = await User.create({
    id,
    name,
    email,
    password,
    isAdmin,
  });
  return result;
};

export const findUser = async ({ condition }: any) => {
  const result = await User.findOne({
    where: condition,
  });
  return result;
};

export const updateUser = async ({ userPayload, condition }: any) => {
  const result = await User.update(userPayload, {
    where: condition,
  });
  return result;
};
