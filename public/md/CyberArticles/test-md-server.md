---
כותרת: בדיקת שרת ה-MD החדש
תאריך: 22/03/2025
מחבר: עמנואל
קטגוריות: בדיקה, שרת MD
תמונה: /images/default-article-thumb.jpg
---

# בדיקת שרת ה-MD החדש

זהו מאמר בדיקה לשרת ה-MD החדש שלנו. אם אתה רואה את המאמר הזה, סימן שהכל עובד כשורה!

## יתרונות המערכת החדשה

1. תוכן דינמי
2. אין צורך בבנייה מחדש
3. עדכון קבצים בזמן אמת

### קוד לדוגמה

```javascript
const fetchMarkdownFile = async () => {
  try {
    const response = await fetch(`http://localhost:3030/md/CyberArticles/test-md-server.md`);
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error(error);
  }
};
```

![תמונה לדוגמה](/images/default-article-thumb.jpg)

בהצלחה! 🎉
