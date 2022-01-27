import * as React from 'react'
import styles from './picture.module.css'

export function Picture(props): JSX.Element {
    return (
        <div
            className={styles.image}
            style={{
                backgroundImage: `url('${props.image})`
            }}
            onClick={props.onClick}
        >
            <div className={styles.title}>
                {props.title}
            </div>
        </div>
    )
}