// AsyncStorage has no native module under Jest; every suite gets the
// library's in-memory mock so repos that touch storage can be imported.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
