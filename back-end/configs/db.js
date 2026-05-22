import mongoose from "mongoose";
// const connectDb=async()=>{
//     try {
//         mongoose.connection.on("connected",()=>{
//             console.log("database connection has established")
//             console.log("DB:", mongoose.connection.name)
//             const collections = mongoose.connection.db.listCollections().toArray()
//             console.log(
//             collections.map(c=>c.name)
//             )
//         })
//         await mongoose.connect(`${process.env.MONGOOSE}/miniFacebook`)
//     } catch (error) {
//         console.log(error.message)
//     }
// } 
const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGOOSE}/miniFacebook`)

        console.log("database connection has established")
        console.log("DB:", mongoose.connection.name)

        const collections = await mongoose.connection.db
            .listCollections()
            .toArray()

        console.log(
            collections.map(c => c.name)
        )

    } catch (error) {
        console.log(error)
    }
}
export default connectDb
