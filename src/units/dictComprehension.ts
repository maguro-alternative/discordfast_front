import { DiscordAdmin } from '../store';


export function UserIdComprehension(
    userList:DiscordAdmin["guildMembers"]
){
    let optionDict: {
        value:string,
        label:string
    };
    let optionList: {
        value:string,
        label:string
    }[] = [];

    userList.forEach(user => {
        optionDict = {
            value:user.userId,
            label:user.userName
        }
        optionList.push(optionDict);
    });

    return optionList;
}

export function UserIdIndexComprehension(
    userIdList:string[],
    userList:DiscordAdmin["guildMembers"]
){
    let optionDict: {
        value:string,
        label:string
    };
    let optionList: {
        value:string,
        label:string
    }[] = Array();

    userList.forEach(user => {
        //console.log(userIdList.indexOf(user.userId));
        if (userIdList.indexOf(user.userId) !== -1){
            optionDict = {
                value:user.userId,
                label:user.userName
            }
            optionList.push(optionDict);
        }
    });

    console.log('optionList',optionList);

    return optionList;
}


export function RoleIdComprehension(
    roleList:DiscordAdmin["guildRoles"]
){
    let optionDict: {
        value:string,
        label:string
    };
    let optionList: {
        value:string,
        label:string
    }[] = [];

    roleList.forEach(role => {
        optionDict = {
            value:role.roleId,
            label:role.roleName
        }
        optionList.push(optionDict);
    });

    return optionList;
}

export function RoleIdIndexComprehension(
    roleIdList:string[],
    roleList:DiscordAdmin["guildRoles"]
){
    let optionDict: {
        value:string,
        label:string
    };
    let optionList: {
        value:string,
        label:string
    }[] = [];

    roleList.forEach(role => {
        if (role.roleId in roleIdList){
            optionDict = {
                value:role.roleId,
                label:role.roleName
            }
            optionList.push(optionDict);
        }
    });

    return optionList;
}
