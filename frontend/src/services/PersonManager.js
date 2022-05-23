import axios from "axios";

const api = "/api/persons";

const getAll = async () => {
  return axios.get(api).then(res => res.data);
};

const create = async person => {
  return axios.post(api, person).then(res => res.data);
};

const update = async person => {
  return axios.put(`${api}/${person.id}`, person).then(res => res.data);
};

const remove = async person => {
  return axios.delete(`${api}/${person.id}`).then(res => res.data);
};

const module = { getAll, create, update, remove };
export default module;
