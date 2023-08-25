import { DiscordAdmin } from '../store';

export function UserIdComprehension(
    userIdList:number[],
    userList:DiscordAdmin["guildMembers"]
){
    let optionDict: {
        value:number,
        name:string
    };
    let optionList: {
        value:number,
        name:string
    }[] = [];

    userList.forEach(user => {
        if (user.userId in userIdList){
            optionDict = {
                value:user.userId,
                name:user.userName
            }
            optionList.push(optionDict);
        }
    });

    return optionList;
}
