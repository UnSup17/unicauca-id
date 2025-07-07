interface IFetchIdScreenData {
  idNumber: string;
  token: string;
  setUserData: (data: any) => void;
  navigation: any;
}

export async function fetchIdScreenData({ idNumber, token, setUserData, navigation }: IFetchIdScreenData) {
  await fetchArmaturaData(idNumber, token, setUserData, navigation);
  await fetchBloodType(idNumber, token, setUserData);

}

async function fetchArmaturaData(idNumber: string, token: string, setUserData: (data: any) => void, navigation: any) {
  fetch(`https://backend.unicauca.edu.co/unid/armatura/${idNumber}/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
  )
    .then((data) => data.text())
    .then((text) => {
      const data = JSON.parse(text);
      setUserData((prev: any) => ({
        ...prev,
        currentUser: {
          ...prev.currentUser,
          data
        }
      }))
      if (data?.personPhoto) {
        navigation.navigate("ID");
      } else {
        navigation.navigate("Welcome");
      }
    })
    .catch(() => null);
}

async function fetchBloodType(idNumber: string, token: string, setUserData: (data: any) => void) {
  fetch(`https://backend.unicauca.edu.co/unid/simca/userBlood/${idNumber}`,
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