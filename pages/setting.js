import Motion from '@components/Animate/Motion'
import { Footer } from '@components/Footer.js'
import Loading from '@components/Loading.js'
import Metatags from '@components/Metatags.js'
import Navbar from '@components/Navbar'
import ThemeSetting from '@components/SettingComponents/ThemeSetting'
import AuthCheck from '@hooks/AuthCheck.js'
import { firestore, postToJSON } from '@lib/firebase.js'
import { Container, Divider, Group, Text } from '@mantine/core'
import React from 'react'
import { Settings } from 'tabler-icons-react'

const LIMIT = 3

export async function getServerSideProps() {
	const postsQuery = firestore.collectionGroup('homePosts').limit(LIMIT)
	const posts = (await postsQuery.get()).docs.map(postToJSON)

	return { props: { posts } }
}

export default function SettingPage({ posts }) {
	return (
		<>
			<div className="bg-background text-accent min-h-[1024px] mb-[235px] pb-10">
				{/* Navar */}
				<Navbar page="/setting" isBusy />
				<Metatags />
				{/* Check user and Setting*/}
				<Container size="md">
					<AuthCheck fallback={<Loading />}>
						<Motion>
							<div className="bg-foreground my-2 w-full rounded-lg pb-2 shadow-md">
								<Group className="py-2 px-4 font-bold w-full text-title">
									<Settings size={18} />
									<Text size="lg" className="font-bold ">
										การตั้งค่า
									</Text>
								</Group>
								<Divider className="opacity-50" />
								<ThemeSetting posts={posts} />
							</div>
						</Motion>
					</AuthCheck>
				</Container>
			</div>
			{/* Footer */}
			<Footer />
		</>
	)
}
