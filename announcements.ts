import { announcementList, room } from "./index";

const announcementsInterval = 120 * 1000;
let announcementPosition = 1;

export function setupAnnouncements() {
    setInterval(() => {
        const announcement: string = `📢 ${announcementList[announcementPosition - 1]}`;
        room.sendAnnouncement(announcement, undefined, 0xFFFFFF, "bold", 0);
        console.log(announcement);
        announcementPosition++;
        if (announcementPosition > announcementList.length) announcementPosition = 1;
    }, announcementsInterval);
}