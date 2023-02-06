import { announcementList, room } from "./index";

const announcementsInterval = 120 * 1000;
let announcementPosition = 1;

export function setupAnnouncements() {
    setInterval(() => {
        room.sendAnnouncement(`📢 ${announcementList[announcementPosition - 1]}`, undefined, 0xFFFFFF, "bold", 0);
        announcementPosition++;
        if (announcementPosition > announcementList.length) announcementPosition = 1;
    }, announcementsInterval);
}