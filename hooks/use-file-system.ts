import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { useState } from 'react'

interface FileResult {
  name: string
  uri: string
  content: string
  size: number | undefined
}

export interface MediaAsset {
  id: string
  filename: string
  uri: string
  mediaType: MediaLibrary.MediaTypeValue
  duration: number
  width: number
  height: number
}

export const useFileSystem = () => {
  const [file, setFile] = useState<FileResult | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  /**
   * Abre el explorador de archivos y lee el archivo que elija el usuario.
   * Devuelve el contenido como string (igual que fs.readFile con encoding 'utf-8')
   */
  const pickFile = async () => {
    setLoading(true)
    setError(undefined)

    try {
      // 1. Abrir el explorador nativo del sistema
      //    copyToCacheDirectory: true → copia el archivo a nuestra sandbox primero
      //    (necesario en Android para acceder a archivos fuera de nuestra app)
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      })

      // El usuario canceló la selección
      if (result.canceled) {
        setLoading(false)
        return
      }

      const asset = result.assets[0]

      // 2. Leer el contenido del archivo como string
      //    Equivalente: fs.readFileSync(path, 'utf-8')
      const content = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      // 3. Obtener metadatos del archivo
      //    Equivalente: fs.stat(path)
      const info = await FileSystem.getInfoAsync(asset.uri)

      setFile({
        name: asset.name,
        uri: asset.uri,
        content,
        size: info.exists ? info.size : undefined,
      })
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Escribe un archivo en el directorio de documentos de la app.
   * Equivalente: fs.writeFileSync(path, content, 'utf-8')
   *
   * @param filename  Nombre del archivo (ej: 'datos.json')
   * @param content   Contenido a escribir
   * @returns         URI del archivo creado
   */
  const writeFile = async (filename: string, content: string): Promise<string | undefined> => {
    try {
      // documentDirectory es la carpeta privada de tu app (persiste entre sesiones)
      // Equivalente a: path.join(__dirname, filename) en Node.js
      const uri = FileSystem.documentDirectory + filename

      await FileSystem.writeAsStringAsync(uri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      return uri
    } catch (err) {
      setError(err as Error)
      return undefined
    }
  }

  /**
   * Lista archivos en el directorio de documentos de la app.
   * Equivalente: fs.readdirSync(dirPath)
   */
  const listFiles = async (): Promise<string[]> => {
    try {
      // documentDirectory nunca es null en runtime, pero TS no lo sabe
      const dir = FileSystem.documentDirectory!
      return await FileSystem.readDirectoryAsync(dir)
    } catch (err) {
      setError(err as Error)
      return []
    }
  }

  /**
   * Pide permisos y devuelve assets de la galería/media del dispositivo.
   * Funciona con fotos, videos y audio (Downloads, Music, DCIM, etc.)
   *
   * @param mediaType  'photo' | 'video' | 'audio' | 'unknown' (default: 'audio')
   * @param first      Cantidad de assets a traer (default: 20)
   */
  const getMediaAssets = async (
    mediaType: MediaLibrary.MediaTypeValue = MediaLibrary.MediaType.audio,
    first = 20,
  ): Promise<MediaAsset[]> => {
    try {
      // Pedir permiso de lectura al usuario
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        setError(new Error('Permiso de media denegado'))
        return []
      }

      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType,
        first,
        sortBy: MediaLibrary.SortBy.creationTime,
      })

      return assets.map((a) => ({
        id: a.id,
        filename: a.filename,
        uri: a.uri,
        mediaType: a.mediaType,
        duration: a.duration,
        width: a.width,
        height: a.height,
      }))
    } catch (err) {
      setError(err as Error)
      return []
    }
  }

  /**
   * Lee el contenido de un asset de medios como string (útil para archivos de texto/JSON).
   * Para imágenes/audio usa directamente el `uri` del asset.
   *
   * @param uri  URI del asset obtenida con getMediaAssets()
   */
  const readMediaAsset = async (uri: string): Promise<string | undefined> => {
    try {
      setLoading(true)
      // Copiar al cache de la app para tener permiso de lectura
      const cacheUri = FileSystem.cacheDirectory! + uri.split('/').pop()
      await FileSystem.copyAsync({ from: uri, to: cacheUri })
      return await FileSystem.readAsStringAsync(cacheUri, {
        encoding: FileSystem.EncodingType.UTF8,
      })
    } catch (err) {
      setError(err as Error)
      return undefined
    } finally {
      setLoading(false)
    }
  }

  return { file, loading, error, pickFile, writeFile, listFiles, getMediaAssets, readMediaAsset }
}
