import { useRouter } from "next/router";
import styles from '../../styles/country.module.css';

export default function Country() {
    const router = useRouter();
    const country = router.query.country;

    // Example data for timeline (add day, month, and year)
    let timelineEvents = [
        { date: '2020-01-15', event: "Event 1", photoURL: "", blogPost:"", tweet:""},
        { date: '2021-06-22', event: "Event 2" },
        { date: '2022-03-10', event: "Event 3" },
        // ... more events
    ];

    // Sort events by date
    timelineEvents = timelineEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className={styles.countryContainer}>
            <h1>{country}</h1>
            <div className={styles.timelineContainer}>
                <div className={styles.timelineLine}></div>
                {timelineEvents.map((item, index) => (
                    <div key={index} className={styles.timelineEvent}>
                        <h2>{item.date}</h2>
                        <p>{item.event}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
