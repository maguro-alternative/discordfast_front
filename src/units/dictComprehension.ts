import { DiscordAdmin } from '../store';


export function UserIdComprehension(
    userList:DiscordAdmin["guildMembers"]
){
    let optionDict: {
        value:number,
        label:string
    };
    let optionList: {
        value:number,
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
    userIdList:number[],
    userList:DiscordAdmin["guildMembers"]
){
    let optionDict: {
        value:number,
        label:string
    };
    let optionList: {
        value:number,
        label:string
    }[] = [];

    userList.forEach(user => {
        if (user.userId in userIdList){
            optionDict = {
                value:user.userId,
                label:user.userName
            }
            optionList.push(optionDict);
        }
    });

    return optionList;
}