export const skipRagNode =
async (state) => {

  return {
    ...state,

    ragContext: ""
  };
};