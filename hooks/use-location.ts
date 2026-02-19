import { Coords } from "@/app/types/definitions";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useLocation = () => {
  const [coords, setCoords] = useState<Coords | undefined>(undefined);
  const [error, setError] = useState<Error | TypeError | undefined>(undefined);

  const getPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError(new Error("Permiso de ubicación denegado"));
      return false;
    }
    return true;
  };

  const getCurrentPosition = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      setCoords(coords);
    } catch (err) {
      setError(err as TypeError);
    }
  };
  useEffect(() => {
    const init = async () => {
      const granted = await getPermissions();
      if (!granted) return;
      await getCurrentPosition();
    };
    init();
  }, []);

  return { coords, error };
};
