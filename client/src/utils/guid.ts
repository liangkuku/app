import {v4 as uuidv4} from 'uuid';

class GuidUtils {
  static getGuid() {
    return uuidv4();
  }
}

export default GuidUtils;
