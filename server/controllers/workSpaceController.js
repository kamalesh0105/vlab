const dockerode=require("dockerode");
const docker = new dockerode({ socketPath: '/var/run/docker.sock' });

const deployWorkspace=async(req,res)=>{
    // const {username}=req.body;
    const username="root";
    const passsword="password";
    try{
    //image definition
    const workspace = await docker.createContainer({
      Image: 'codercom/code-server:4.102.2-39',
      name:'code-server-userAdmin',
      ExposedPorts:{
        '8080/tcp':{},
      },
      HostConfig: {
        PortBindings: {
          '8080/tcp': [{ HostPort: '9000' }] // Expose container's 8080 to host 9000
        },
        AutoRemove:true,
        Memory: 512 * 1024 * 1024, // 512MB memory limit
        MemorySwap: 1024 * 1024 * 1024, // 1GB swap
        CpuShares: 512, // CPU limit
      },
      Env:[
     `PASSWORD=${password}`,
      `USER=${username}`, 
      ]
    });

    //start conatiner
    await workspace.start();
    res.status(200).json({
       success:true,
       data:{
        password:"Rootuser"
       }
    })
    
    }catch(e){
      console.log("Error deploying container.."+e);
      res.status(500).json({
       success:false,
      msg:e.message,
     });
    }

}

module.exports= {
    deployWorkspace
};