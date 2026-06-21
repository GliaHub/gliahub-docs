// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://gliahub.github.io',
	base: '/gliahub-docs',
	integrations: [
		starlight({
			title: 'Gliahub Dokümantasyonu',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/gliahub/gliahub' }],
			sidebar: [
				{
					label: 'Mimari ve Sistem Tasarımı',
					items: [
						{ label: 'Sistem Tasarımı (v2)', slug: 'architecture/system_design' },
					],
				},
				{
					label: 'Yol Haritası & Sürüm Planlama',
					items: [
						{ label: 'Sprint Planlaması & Kapsam', slug: 'roadmap/sprint_planning_and_scope' },
						{ label: '42 Sprint Yol Haritası', slug: 'roadmap/sprints' },
					],
				},
				{
					label: 'Kurulum & Altyapı',
					items: [
						{ label: 'GitHub Organizasyonu', slug: 'setup/github_org_setup' },
					],
				},
				{
					label: 'Rehberler',
					items: [
						{ label: 'Örnek Rehber', slug: 'guides/example' },
					],
				},
			],
		}),
	],
});
