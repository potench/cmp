/* eslint-disable max-nested-callbacks */

import { expect } from 'chai';
import { init } from '../lib/init';

const fakeScriptSrc = "./fake-loader-src.js";
let cmpLoader;

describe('cmpLoader as import', () => {
	beforeEach(() => {
		cmpLoader = require("../loader");
	});

	afterEach(() => {
		cmpLoader = null;
		global.cmp = null;
		jest.resetModules();
	});

	it.skip('requires initialization', done => {
		expect(cmpLoader).to.not.be.undefined;
		expect(typeof cmpLoader).to.equal('function');
		// expect commandQueue to not exist
		done();
	});

	it.skip('allows you to use cmpLoader as API shim to CMP', done => {
		init({}, cmpLoader).then(() => {
			cmpLoader('showConsentTool', null, result => {
				expect(result).to.equal(true);
				done();
			});
		});
	});

	describe("cmpLoader import and scriptLoading", () => {
		global.cmp = cmpLoader;
		let appendChild;

		beforeEach(() => {
			 console.log(111);
			window.fetch = jest.fn().mockImplementation(src => {
				console.log("fetch:", src);
				return Promise.resolve(src);
			});
			appendChild = window.document.body.appendChild = jest.fn((dom) => {
				console.log("require cmp", dom);
				require('../s1/cmp'); // need to require this here because there is no built version that we can script load
			});
		});

		afterEach(() => {
			console.log(222);
			window.fetch.mockRestore();
			appendChild.mockRestore();
			jest.resetModules();
			global.cmp = null;
		});

		it('allows you to use scriptloader', done => {
			global.cmp(
				'init',
				{
					scriptSrc: fakeScriptSrc,
					countryCode: 'ES'
				},
				() => {
					done();
					// global.cmp('showConsentTool', null, result => {
					// 	expect(result).to.equal(true);
					// 	done();
					// });
				}
			);
		});
	});
});
