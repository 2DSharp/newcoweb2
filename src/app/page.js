"use client"

import LoginPage from "./login/page";
import EntryPageLayout from "./entrypage";

const HomePage = () => {

    return (
        <EntryPageLayout>
            <LoginPage/>
        </EntryPageLayout>
    );
}

export default HomePage;