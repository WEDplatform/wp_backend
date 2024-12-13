export const dbname="weddorspfp"  // database name
const refreshTokenOption={
    httpOnly:true,
    secure:false,
    maxAge:10*60*1000
}
const accessTokenOption={
    httpOnly:true,
    secure:false,
    maxAge:10*60*1000
}
export {accessTokenOption,refreshTokenOption}