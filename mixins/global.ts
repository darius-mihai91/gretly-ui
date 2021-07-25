import { accessorType } from '~/store';

type Accesor = typeof accessorType;

export interface IGlobalMixin {
	toUpper(s: string): string;
	ucFirst(s: string): string;
	$auth: Accesor['auth'];
}

export default {
	methods: {
		ucFirst(s: string) {
			return s.charAt(0).toUpperCase() + s.slice(1);
		},
		toUpper(s: string) {
			return s.toUpperCase();
		}
	},
	computed: {
		$auth(): Accesor['auth'] {
			return this['$accessor'].auth;
		}
	}
};