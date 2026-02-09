export const isAdmin = (group, userId) => {
  return group.admins.some(
    (id) => id.toString() === userId
  );
};

export const isMember = (group, userId) => {
  return group.members.some(
    (id) => id.toString() === userId
  );
};
