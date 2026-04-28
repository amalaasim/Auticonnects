   300	    } else {
   301	      setFeedback("Try again!");
   302	    }
   303	  };
   304	
   305	return (
   306	  <Box
   307	    sx={{
   308	      cursor: `url(${click}) 22 22, auto`,
   309	      position: "fixed",
   310	      inset: 0,
   311	      zIndex: 10000,
   312	      pointerEvents: "auto",
   313	      display: "flex",
   314	      alignItems: "center",
   315	      justifyContent: "center",
   316	    }}
   317	  >
   318	    <Box sx={{ 
   319	      position: "relative", 
   320	      width: "max(65cqw, 80cqh)",
   321	      maxWidth: "80vw", 
   322	      maxHeight: "80vh",
   323	      aspectRatio: "620 / 800",
   324	      display: "flex",
   325	      alignItems: "center",
   326	      justifyContent: "flex-start",
   327	      flexDirection: "column"
   328	    }}>
   329	      {/* Background Image Board */}
   330	      <Box
   331	        component="img"
   332	        src={pegion}
   333	        sx={{
   334	          position: "absolute",
   335	          width: "100%",
   336	          height: "100%",
   337	          objectFit: "fill",
   338	          zIndex: 1,
   339	        }}
   340	      />
   341	
   342	      <Box sx={{
   343	        position: "relative",
   344	        width: "60%",
   345	        display: "flex",
   346	        justifyContent: "space-between",
   347	        alignItems: "center",
   348	        zIndex: 5,
   349	        marginTop: "8%"
   350	      }}>
   351	        <Typography
   352	          sx={{
   353	            fontSize: "max(3cqw, 4.5cqh)",
   354	            fontStyle: "normal",
   355	            lineHeight: "1",
   356	            fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
   357	            color: "#5d2a00",
   358	            opacity: 0.9,
   359	          }}
   360	        >
   361	          {t("adult")}
   362	        </Typography>
   363	        <CloseIcon onClick={closeModal} sx={{
   364	          fontSize: "max(3cqw, 4.5cqh)",
   365	          color: "#5d2a00",
   366	          cursor: "pointer"
   367	        }} />
   368	      </Box>
   369	
   370	      {/* Main Content Area */}
   371	      <Box sx={{
   372	        position: "relative",
   373	        display: "flex",
   374	        flexDirection: "column",
   375	        alignItems: "center",
   376	        width: "70%",
   377	        marginTop: "10%",
   378	        padding: "4%",
   379	        zIndex: 10000,
   380	        backgroundColor: "rgba(255,255,255,0.05)",
   381	        backdropFilter: "blur(8px)",
   382	        borderRadius: "10px",
   383	        gap: "max(2cqw, 3cqh)"
   384	      }}>
   385	        <Typography
   386	          sx={{
   387	            fontSize: "max(1.8cqw, 2.7cqh)",
   388	            fontStyle: "normal",
   389	            lineHeight: "1.2",
   390	            fontWeight: "800",
   391	            fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
   392	            color: "#883901",
   393	            textAlign: "center",
   394	            opacity: 0.9,
   395	          }}>
   396	          {t("shoeQuestion")}
   397	        </Typography>
   398	
   399	        <TextField
   400	          variant="filled"
   401	          InputProps={{ disableUnderline: true }}
   402	          value={userAnswer}
   403	          onChange={(e) => setUserAnswer(e.target.value)}
   404	          placeholder="Enter your answer"
   405	          sx={{
   406	            width: "80%",
   407	            color: "#824D1F",
   408	            backgroundColor: "#824D1F",
   409	            borderRadius: "8px",
   410	            mixBlendMode: "multiply",
   411	            '& input': {
   412	              color: '#c9742e',
   413	              padding: "max(1cqw, 1.5cqh)",
   414	              textAlign: "center",
   415	              fontFamily: "Chewy",
   416	              fontWeight: 400,
   417	              fontSize: "max(1.8cqw, 2.7cqh)",
   418	            }
   419	          }}
   420	        />
   421	        
   422	        {feedback && (
   423	          <Typography sx={{ color: feedback === "Correct!" ? "green" : "red", fontFamily: "Chewy", fontSize: "max(1.2cqw, 1.8cqh)", marginTop: "-max(1cqw, 1cqh)" }}>
   424	            {feedback}
   425	          </Typography>
   426	        )}
   427	
   428	        <Box
   429	          onClick={handleSubmit}
   430	          sx={{
   431	            width: "60%",
   432	            height: "max(4cqw, 6cqh)",
   433	            cursor: "pointer",
   434	            position: "relative",
   435	            display: "flex",
   436	            alignItems: "center",
   437	            justifyContent: "center",
   438	          }}
   439	        >
   440	          <Box component='img' src={contin} sx={{ position: "absolute", width: "100%", height: "100%", objectFit: "fill" }} />
   441	          <Typography
   442	            sx={{
   443	              position: "relative",
   444	              zIndex: 2,
   445	              fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
   446	              display: "flex",
   447	              alignItems: "center",
   448	              justifyContent: "center",
   449	              color: "#482406",
   450	              fontWeight: "900",
   451	              fontSize: "max(1.8cqw, 2.7cqh)",
   452	              pointerEvents: "none",
   453	            }}
   454	          >
   455	            {t("Continue")}
   456	          </Typography>
   457	        </Box>
   458	      </Box>
   459	    </Box>
   460	  </Box>
   461	);
   462	
   463	return(
   464	
   465	 <Box
