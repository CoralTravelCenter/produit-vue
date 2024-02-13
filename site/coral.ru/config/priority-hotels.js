import hotels from './priority-hotels.yaml'

export default hotels.map((hotel) => {
    hotel.arealName = hotel.arealName.replace(/\(.*?\)/g, '');
    return hotel;
});