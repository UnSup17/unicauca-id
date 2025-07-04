import Constants from 'expo-constants';

interface IFetchIdScreenData {
  idNumber: string;
  token: string;
  setUserData: (data: any) => void;
}

export async function fetchIdScreenData({ idNumber, token, setUserData }: IFetchIdScreenData) {
  fetchPP(idNumber, token, setUserData);
  fetchBloodType(idNumber, token, setUserData);
}

async function fetchPP(idNumber: string, token: string, setUserData: (data: any) => void) {
  fetch(`http://192.168.52.65:8080/unid/armatura/pp/${idNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
  )
    .then((data) => data.text())
    .then((text) => setUserData((prev: any) => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        pp: text
      }
    })))
    .catch(() => null);
}

async function fetchBloodType(idNumber: string, token: string, setUserData: (data: any) => void) {
  fetch(
      `http://192.168.52.65:8080/unid/simca/userBlood/${idNumber}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((data) => data.text())
      .then((text) => setUserData((prev: any) => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        blood: text
      }
    })))
      .catch(() => null);
}